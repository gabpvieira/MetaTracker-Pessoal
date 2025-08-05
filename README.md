# 📊 MetaTracker Pessoal

Aplicação web moderna para controle e acompanhamento de metas semanais com integração ao Google Sheets.

## ✨ Funcionalidades

- 🔐 **Autenticação OAuth do Google** - Login seguro com sua conta Google
- 📊 **Dashboard Interativo** - Visualização clara do progresso das metas
- 📈 **Gráficos e Métricas** - Charts em tempo real com dados da planilha
- 📱 **Design Responsivo** - Interface moderna que funciona em qualquer dispositivo
- 🔄 **Sincronização Automática** - Dados sempre atualizados do Google Sheets
- 🎯 **Acompanhamento de Metas** - Controle visual do progresso semanal

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework JavaScript moderno
- **Vite** - Build tool rápido e eficiente
- **Recharts** - Biblioteca de gráficos responsivos
- **Google Sheets API** - Integração com planilhas do Google
- **CSS3** - Estilização moderna com gradientes e animações

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- Conta Google com acesso ao Google Cloud Console
- Planilha do Google Sheets configurada

## ⚙️ Configuração

### 1. Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**
4. Crie credenciais:
   - **API Key** para acesso à API
   - **OAuth 2.0 Client ID** para autenticação
5. Configure as origens autorizadas (ex: `http://localhost:5173`)

### 2. Configuração da Planilha

Crie uma planilha no Google Sheets com as seguintes abas:

**Aba "Controle Semanal":**
| Data | Categoria | Valor | Descrição | Status |
|------|-----------|-------|-----------|--------|
| 01/01/2024 | Prestação de Serviço | R$ 500,00 | Projeto X | Concluído |

**Aba "Resumo Anual":**
| Mês | Receita | Despesa |
|-----|---------|----------|
| Janeiro | R$ 5.000,00 | R$ 1.500,00 |

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gabpvieira/MetaTracker-Pessoal.git
cd MetaTracker-Pessoal
```

2. Instale as dependências:
```bash
npm install
```

3. Configure suas credenciais no arquivo `meta_tracker_app.tsx`:
```javascript
const [config, setConfig] = useState({
  clientId: 'SEU_CLIENT_ID_AQUI',
  apiKey: 'SUA_API_KEY_AQUI',
  spreadsheetId: 'ID_DA_SUA_PLANILHA_AQUI',
  // ...
});
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse `http://localhost:5173` no seu navegador

## 📱 Como Usar

1. **Login**: Faça login com sua conta Google
2. **Visualização**: Veja suas métricas e progresso no dashboard
3. **Atualização**: Use o botão "Atualizar" para sincronizar com a planilha
4. **Acompanhamento**: Monitore seu progresso em tempo real

## 🎨 Design

A aplicação possui um design moderno e profissional com:

- 🌈 **Gradientes suaves** e paleta de cores harmoniosa
- ✨ **Animações fluidas** e transições suaves
- 📊 **Cards informativos** com métricas importantes
- 📈 **Gráficos interativos** com tooltips e legendas
- 📱 **Layout responsivo** para todos os dispositivos

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/gabpvieira/MetaTracker-Pessoal/issues) no GitHub.

---

**Desenvolvido com ❤️ para ajudar no controle de metas pessoais**