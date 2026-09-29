import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calculator, Package, AlertCircle } from 'lucide-react'

interface TabelaFrete {
  SEDEX: {
    metropolitana: {
      faixas: Array<{ peso_min_g: number; peso_max_g: number; valor: number }>
      adicional_por_kg: number
    }
    interior: {
      faixas: Array<{ peso_min_g: number; peso_max_g: number; valor: number }>
      adicional_por_kg: number
    }
  }
  PAC: {
    faixas: Array<{ peso_min_g: number; peso_max_g: number; valor: number }>
    adicional_por_kg: number
  }
}

interface Resultado {
  servico: string
  regiao?: string
  peso: number
  unidade: string
  valor: number
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [peso, setPeso] = useState('')
  const [unidade, setUnidade] = useState('kg')
  const [servico, setServico] = useState('')
  const [regiaoSedex, setRegiaoSedex] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [erro, setErro] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [tabelasFrete, setTabelasFrete] = useState<TabelaFrete | null>(null)

  // Carregar tabelas de frete
  useEffect(() => {
    const carregarTabelas = async () => {
      try {
        const response = await fetch('/tabelas_frete.json')
        const dados = await response.json()
        setTabelasFrete(dados)
      } catch (err) {
        console.error('Erro ao carregar tabelas:', err)
        setErro('Erro ao carregar as tabelas de frete. Por favor, recarregue a página.')
      }
    }

    carregarTabelas()
  }, [])

  const calcularFrete = async () => {
    setErro('')
    setResultado(null)
    setIsCalculating(true)

    // Simular delay para mostrar animação de loading
    await new Promise(resolve => setTimeout(resolve, 800))

    try {
      if (!tabelasFrete) {
        throw new Error('Tabelas de frete não carregadas.')
      }

      // Validação do peso
      const pesoNumerico = parseFloat(peso)
      if (!peso || isNaN(pesoNumerico) || pesoNumerico <= 0) {
        throw new Error('Por favor, insira um peso válido maior que zero.')
      }

      // Validação do serviço
      if (!servico) {
        throw new Error('Por favor, selecione um tipo de serviço.')
      }

      // Validação da região para SEDEX
      if (servico === 'SEDEX' && !regiaoSedex) {
        throw new Error('Por favor, selecione a região para o serviço SEDEX.')
      }

      // Converter peso para gramas
      let pesoEmGramas = pesoNumerico
      if (unidade === 'kg') {
        pesoEmGramas = pesoNumerico * 1000
      }

      let tabelaServico
      if (servico === 'SEDEX') {
        tabelaServico = tabelasFrete.SEDEX[regiaoSedex as keyof typeof tabelasFrete.SEDEX]
      } else {
        tabelaServico = tabelasFrete.PAC
      }

      if (!tabelaServico) {
        throw new Error('Tabela de serviço não encontrada. Verifique as seleções.')
      }

      let valorFrete = 0

      // Verificar se o peso está dentro das faixas da tabela
      const faixaEncontrada = tabelaServico.faixas.find(
        faixa => pesoEmGramas >= faixa.peso_min_g && pesoEmGramas <= faixa.peso_max_g
      )

      if (faixaEncontrada) {
        valorFrete = faixaEncontrada.valor
      } else if (pesoEmGramas > 30000) {
        // Peso acima de 30kg - calcular valor adicional
        const pesoBase30kg = tabelaServico.faixas[tabelaServico.faixas.length - 1].valor
        const pesoExcedente = (pesoEmGramas - 30000) / 1000 // converter para kg
        const valorAdicional = pesoExcedente * tabelaServico.adicional_por_kg
        valorFrete = pesoBase30kg + valorAdicional
      } else {
        throw new Error('Peso fora da faixa de atendimento.')
      }

      setResultado({
        servico,
        regiao: servico === 'SEDEX' ? regiaoSedex : undefined,
        peso: pesoNumerico,
        unidade,
        valor: valorFrete
      })
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao calcular frete.')
    } finally {
      setIsCalculating(false)
    }
  }

  const limparFormulario = () => {
    setPeso('')
    setUnidade('kg')
    setServico('')
    setRegiaoSedex('')
    setResultado(null)
    setErro('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600">
              Calculadora de Frete
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Calcule o valor do frete dos Correios de forma rápida e precisa
          </p>
        </div>

        {/* Formulário Principal */}
        <Card className="mb-6 shadow-xl border-0 bg-white">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="w-5 h-5" />
              Dados do Envio
            </CardTitle>
            <CardDescription>
              Informe o peso do pacote e selecione o tipo de serviço
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Campo de Peso */}
            <div className="space-y-2">
              <Label htmlFor="peso" className="text-sm font-medium">
                Peso do Pacote
              </Label>
              <div className="flex gap-2">
                <Input
                  id="peso"
                  type="number"
                  placeholder="Ex: 2.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="flex-1"
                  min="0"
                  step="0.1"
                />
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seleção de Serviço */}
            <div className="space-y-2">
              <Label htmlFor="servico" className="text-sm font-medium">
                Tipo de Serviço
              </Label>
              <Select value={servico} onValueChange={setServico}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDEX">SEDEX - Entrega Expressa</SelectItem>
                  <SelectItem value="PAC">PAC - Entrega Econômica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Região para SEDEX */}
            {servico === 'SEDEX' && (
              <div className="space-y-2 animate-in fade-in">
                <Label htmlFor="regiaoSedex" className="text-sm font-medium">
                  Região SEDEX
                </Label>
                <Select value={regiaoSedex} onValueChange={setRegiaoSedex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metropolitana">Metropolitana</SelectItem>
                    <SelectItem value="interior">Interior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={calcularFrete}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular Frete
                  </>
                )}
              </Button>
              <Button
                onClick={limparFormulario}
                variant="outline"
                size="lg"
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <Card className="mb-6 shadow-xl border-0 bg-green-50 border-l-4 border-l-green-500">
            <CardHeader className="bg-green-100 border-b">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Resultado do Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Serviço:</span>
                  <Badge className="bg-blue-600">
                    {resultado.servico} {resultado.regiao ? `(${resultado.regiao})` : ''}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Peso:</span>
                  <span className="font-semibold">
                    {resultado.peso} {resultado.unidade}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Valor do Frete</p>
                    <p className="text-4xl font-bold text-green-600">
                      R$ {resultado.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Erro */}
        {erro && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              {erro}
            </AlertDescription>
          </Alert>
        )}

        {/* Informações Adicionais */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-sm text-gray-700">Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2 p-6">
            <p>
              <strong>SEDEX:</strong> Entrega expressa com prazo reduzido. Oferecemos preços diferenciados para região metropolitana e interior.
            </p>
            <p>
              <strong>PAC:</strong> Entrega econômica com melhor custo-benefício para envios que não têm pressa.
            </p>
            <p>
              Valores válidos para envios até 30kg. Para pesos acima de 30kg, é aplicada taxa adicional por quilograma.
            </p>
            <p>
              Preços baseados na tabela oficial dos Correios.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
