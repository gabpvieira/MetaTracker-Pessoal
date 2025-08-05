import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MetaTrackerApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Configuração do Google API
  const [config, setConfig] = useState({
    clientId: '1055649473936-aqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhq.apps.googleusercontent.com',
    apiKey: 'AIzaSyBqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhq',
    spreadsheetId: '1Bqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhqhq',
    discoveryDoc: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
    scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  });

  // Função para obter saudação baseada no horário
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return '🌅 Bom dia, Gabriel!';
    if (hora < 18) return '☀️ Boa tarde, Gabriel!';
    return '🌙 Boa noite, Gabriel!';
  };

  // Inicializar Google API
  const initializeGapi = async () => {
    try {
      await window.gapi.load('auth2', async () => {
        await window.gapi.auth2.init({
          client_id: config.clientId,
        });
      });
      
      await window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: config.apiKey,
          discoveryDocs: [config.discoveryDoc],
        });
      });
    } catch (error) {
      console.error('Erro ao inicializar Google API:', error);
      setError('Erro ao conectar com Google API. Verifique suas credenciais.');
    }
  };

  // Fazer login
  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      
      await initializeGapi();
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      if (user.isSignedIn()) {
        setIsAuthenticated(true);
        await fetchSheetData();
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Fazer logout
  const handleLogout = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsAuthenticated(false);
      setDashboardData(null);
      setError('');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Buscar dados da planilha
  const fetchSheetData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar dados das diferentes abas
      const response = await window.gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: config.spreadsheetId,
        ranges: [
          'Controle Semanal!A:E',
          'Resumo Anual!A:C'
        ]
      });
      
      const [semanais, anuais] = response.result.valueRanges;
      
      // Processar dados semanais
      const dadosSemanais = semanais.values?.slice(1) || [];
      const dadosAnuais = anuais.values?.slice(1) || [];
      
      // Calcular métricas
      const metaSemanal = 2500; // Meta fixa de R$ 2.500
      
      // Somar receitas da semana atual
      const receitaSemana = dadosSemanais.reduce((total, linha) => {
        const valor = parseFloat(linha[2]?.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
        return total + valor;
      }, 0);
      
      // Calcular progresso
      const progresso = receitaSemana / metaSemanal;
      const faltaParaMeta = Math.max(0, metaSemanal - receitaSemana);
      
      // Agrupar por categoria
      const porCategoria = dadosSemanais.reduce((acc, linha) => {
        const categoria = linha[1] || 'Outros';
        const valor = parseFloat(linha[2]?.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
        acc[categoria] = (acc[categoria] || 0) + valor;
        return acc;
      }, {});
      
      // Calcular totais anuais
      const receitaAno = dadosAnuais.reduce((total, linha) => {
        const valor = parseFloat(linha[1]?.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
        return total + valor;
      }, 0);
      
      const despesaAno = dadosAnuais.reduce((total, linha) => {
        const valor = parseFloat(linha[2]?.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
        return total + valor;
      }, 0);
      
      const lucroAno = receitaAno - despesaAno;
      
      setDashboardData({
        metaSemanal,
        receitaSemana,
        progresso,
        faltaParaMeta,
        porCategoria,
        receitaAno,
        despesaAno,
        lucroAno
      });
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados da planilha. Verifique as permissões.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se já está autenticado ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initializeGapi();
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          setIsAuthenticated(true);
          await fetchSheetData();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };
    
    if (window.gapi) {
      checkAuth();
    }
  }, []);

  // Tela de configuração inicial
  if (!config.clientId || !config.apiKey || !config.spreadsheetId) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">📊</div>
          <h1 className="login-title">Meta Tracker</h1>
          <p className="login-subtitle">Configure suas credenciais do Google para começar</p>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Client ID:
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu Client ID do Google Console"
                  value={config.clientId}
                  onChange={(e) => setConfig({...config, clientId: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google API Key:
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua API Key do Google Console"
                  value={config.apiKey}
                  onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID da Planilha:
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID da sua planilha (da URL)"
                  value={config.spreadsheetId}
                  onChange={(e) => setConfig({...config, spreadsheetId: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📝 Como obter as credenciais:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Acesse o Google Cloud Console</li>
                <li>Crie um projeto ou selecione um existente</li>
                <li>Ative a Google Sheets API</li>
                <li>Crie credenciais (API Key e OAuth Client ID)</li>
                <li>Configure as origens autorizadas</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">📊</div>
          <h1 className="login-title">Meta Tracker</h1>
          <p className="login-subtitle">Acesse sua planilha de controle de metas</p>
          
          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-text">{error}</div>
            </div>
          )}
          
          <button
            onClick={handleLogin}
            className="login-button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  // Cores para o gráfico de pizza
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

  // Preparar dados para gráficos
  const chartData = dashboardData ? [
    { name: 'Prestação de Serviço', value: dashboardData.porCategoria['Prestação de Serviço'] },
    { name: 'Infoprodutos', value: dashboardData.porCategoria['Infoprodutos'] },
    { name: 'Vendas Online', value: dashboardData.porCategoria['Vendas Online'] }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <span className="dashboard-logo-icon">📊</span>
            <h1 className="dashboard-title">Meta Tracker</h1>
          </div>
          <div className="dashboard-user-section">
            <div className="dashboard-user-info">
              <div className="dashboard-user-avatar">👤</div>
              <span className="dashboard-user-name">Gabriel</span>
            </div>
            <button
              onClick={fetchSheetData}
              disabled={loading}
              className="refresh-button"
              title="Atualizar dados"
            >
              {loading ? '🔄' : '🔄'}
            </button>
            <button
              onClick={handleLogout}
              className="logout-button"
              title="Sair"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Saudação */}
        <div className="greeting-card">
          <h2>{getSaudacao()}</h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Carregando dados da planilha...</p>
          </div>
        )}

        {/* Dashboard Cards */}
        {dashboardData ? (
          <div className="space-y-6">
            {/* Métricas principais */}
            <div className="metrics-grid">
              {/* Meta Semanal */}
              <div className="metric-card">
                <div className="metric-content">
                  <div>
                    <p className="metric-label">Meta Semanal</p>
                    <p className="metric-value">
                      R$ {dashboardData.metaSemanal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="metric-icon blue">
                    🎯
                  </div>
                </div>
              </div>

              {/* Receita da Semana */}
              <div className="metric-card">
                <div className="metric-content">
                  <div>
                    <p className="metric-label">Receita desta Semana</p>
                    <p className="metric-value">
                      R$ {dashboardData.receitaSemana.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="metric-icon green">
                    💰
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div className="metric-card">
                <div className="metric-content">
                  <div>
                    <p className="metric-label">Progresso</p>
                    <p className={`metric-value ${dashboardData.progresso >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {(dashboardData.progresso * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dashboardData.progresso >= 1 ? 'Meta atingida! 🎉' : 'Continue focado! 💪'}
                    </p>
                  </div>
                  <div className={`metric-icon ${dashboardData.progresso >= 1 ? 'green' : 'red'}`}>
                    {dashboardData.progresso >= 1 ? '✅' : '🔴'}
                  </div>
                </div>
              </div>

              {/* Falta para Meta */}
              <div className="metric-card">
                <div className="metric-content">
                  <div>
                    <p className="metric-label">Falta para Meta</p>
                    <p className="metric-value">
                      {dashboardData.faltaParaMeta > 0 
                        ? `R$ ${dashboardData.faltaParaMeta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
                        : 'Meta atingida! 🎉'
                      }
                    </p>
                  </div>
                  <div className="metric-icon orange">
                    ⏰
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="charts-grid">
              {/* Receitas por Categoria */}
              <div className="chart-card">
                <h3 className="chart-title">📈 Receitas por Categoria (Esta Semana)</h3>
                <div className="space-y-4">
                  {Object.entries(dashboardData.porCategoria).map(([categoria, valor]) => (
                    <div key={categoria} className="flex justify-between items-center">
                      <span className="text-gray-600">{categoria}:</span>
                      <span className="font-semibold text-gray-900">
                        R$ {valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                  ))}
                </div>
                
                {chartData.length > 0 && (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Valor']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Resumo Anual */}
              <div className="chart-card">
                <h3 className="chart-title">📊 Resumo Anual</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Receita Total:</span>
                    <span className="font-semibold text-green-600">
                      R$ {dashboardData.receitaAno.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Despesa Total:</span>
                    <span className="font-semibold text-red-600">
                      R$ {dashboardData.despesaAno.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-800 font-medium">Lucro Líquido:</span>
                    <span className={`font-bold text-lg ${dashboardData.lucroAno >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {dashboardData.lucroAno.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                </div>

                {/* Barra de progresso visual da meta semanal */}
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progresso da Meta Semanal</span>
                    <span className="progress-percentage">{(dashboardData.progresso * 100).toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${
                        dashboardData.progresso >= 1 ? 'complete' : 'incomplete'
                      }`}
                      style={{ width: `${Math.min(dashboardData.progresso * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            {dashboardData.progresso < 1 && (
              <div className="cta-card warning">
                <div className="cta-content">
                  <div>
                    <h3 className="cta-title">🚀 Foco na Meta!</h3>
                    <p className="cta-text">
                      Faltam apenas R$ {dashboardData.faltaParaMeta.toLocaleString('pt-BR', {minimumFractionDigits: 2})} para atingir sua meta semanal!
                    </p>
                  </div>
                  <div className="cta-emoji">💪</div>
                </div>
              </div>
            )}

            {dashboardData.progresso >= 1 && (
              <div className="cta-card success">
                <div className="cta-content">
                  <div>
                    <h3 className="cta-title">🎉 Parabéns, Gabriel!</h3>
                    <p className="cta-text">
                      Você atingiu {(dashboardData.progresso * 100).toFixed(0)}% da sua meta semanal! Continue assim!
                    </p>
                  </div>
                  <div className="cta-emoji">🏆</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Estado inicial - sem dados
          <div className="empty-state">
            <div className="empty-state-card">
              <div className="empty-state-icon">📊</div>
              <h3 className="empty-state-title">Bem-vindo ao Meta Tracker!</h3>
              <p className="empty-state-text">
                Clique em "Atualizar" para carregar os dados da sua planilha e visualizar seu progresso.
              </p>
              <button
                onClick={fetchSheetData}
                disabled={loading}
                className="empty-state-button"
              >
                {loading ? '🔄 Carregando...' : '📈 Carregar Dashboard'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Meta Tracker - Controle suas metas semanais com facilidade 📊</p>
        </div>
      </footer>

      {/* Script do Google API */}
      <script src="https://apis.google.com/js/api.js"></script>
    </div>
  );
};

export default MetaTrackerApp;