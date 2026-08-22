# TutorialHUD — RPG Maker MV

Plugin desenvolvido para adicionar uma interface interativa de tutorial ao **RPG Maker MV**.

O projeto foi criado originalmente para o jogo **Missão UAI**, desenvolvido como Trabalho de Conclusão de Curso, com o objetivo de facilitar a adaptação de jogadores que não possuem experiência prévia com jogos desenvolvidos no RPG Maker.

A proposta do plugin é complementar os eventos normais do RPG Maker MV, fornecendo uma HUD capaz de apresentar instruções, representar visualmente os controles e reagir em tempo real às teclas pressionadas pelo jogador.

---

## Versão atual

**v0.1.0**

Versão inicial de desenvolvimento.

---

## Funcionalidades

Atualmente, o TutorialHUD possui:

- HUD de tutorial no canto superior esquerdo;
- interface maior que a HUD convencional de missões;
- instruções diferentes para cada etapa do tutorial;
- representação visual das teclas utilizadas;
- destaque das teclas enquanto estão sendo pressionadas;
- suporte a:
    - movimentação;
    - corrida;
    - interação;
    - menu;
    - acesso às missões;
    - rastreamento de missões;
- integração com **Galv's Quest Log**;
- integração com o sistema de missões utilizado pelo projeto;
- detecção do rastreamento manual de uma missão pelo jogador;
- suporte simultâneo ao **MissaoHUD**.

---

## Objetivo do projeto

Durante testes preliminares do jogo **Missão UAI**, alguns jogadores que não possuíam familiaridade com RPG Maker MV demonstraram dificuldade em compreender os controles básicos.

O TutorialHUD foi criado para oferecer uma solução mais visual e interativa.

Em vez de apenas apresentar uma caixa de texto explicando os controles, o plugin permite mostrar os botões na tela e reagir diretamente às entradas realizadas pelo jogador.

Exemplo:

```text
┌─────────────────────────────────────┐
│ MOVIMENTAÇÃO                        │
│                                     │
│ Use as teclas indicadas para andar. │
│                                     │
│              [ ↑ ]                  │
│          [ ← ][ ↓ ][ → ]            │
│                                     │
└─────────────────────────────────────┘
```

Quando uma tecla é pressionada, sua representação na HUD muda visualmente.

---

## Dependências

Para utilizar todas as funcionalidades da versão atual, são utilizados:

- **RPG Maker MV**
- **Galv's Quest Log**
- **MissaoHUD**

O TutorialHUD deve ser colocado abaixo dos outros plugins.

### Ordem recomendada

```text
Galv_QuestLog
MissaoHUD
TutorialHUD
```

Isso é especialmente importante porque tanto o MissaoHUD quanto o TutorialHUD podem acompanhar alterações realizadas pelo sistema de rastreamento do Galv's Quest Log.

---

## Instalação

1. Baixe o arquivo:

```text
TutorialHUD.js
```

2. Copie o arquivo para:

```text
SeuProjeto/
└── js/
    └── plugins/
        └── TutorialHUD.js
```

3. Abra o RPG Maker MV.

4. Acesse:

```text
Ferramentas
→ Gerenciador de Plugins
```

5. Adicione:

```text
TutorialHUD
```

6. Defina o status como:

```text
ON
```

7. Certifique-se de que a ordem esteja:

```text
Galv_QuestLog
MissaoHUD
TutorialHUD
```

---

## Parâmetros

A versão atual possui os seguintes parâmetros configuráveis:

### Largura

Define a largura da HUD.

Valor padrão:

```text
360
```

---

### Altura

Define a altura da HUD.

Valor padrão:

```text
190
```

---

### Margem

Distância da HUD em relação às bordas da tela.

Valor padrão:

```text
12
```

---

### OpacidadeFundo

Define a transparência do fundo da HUD.

Valor padrão:

```text
190
```

---

### CorDestaque

Cor utilizada em títulos, bordas e teclas pressionadas.

Valor padrão:

```text
#D99A4E
```

---

### TutorialQuestId

ID da missão utilizada como tutorial.

Valor padrão:

```text
5
```

---

### QuestExemploId

ID da missão utilizada para ensinar o rastreamento de missões.

Valor padrão:

```text
6
```

---

### IntegracaoQuestLog

Ativa ou desativa a integração automática com o Galv's Quest Log.

Valor padrão:

```text
true
```

---

# Script Calls

## Preparar o tutorial

```javascript
TutorialHUD.prepare();
```

Inicializa a HUD e prepara as missões utilizadas pelo tutorial.

Na configuração padrão:

```text
Quest 5 → Conclua o Tutorial
Quest 6 → Quest Exemplo
```

A missão do tutorial passa a ser rastreada automaticamente.

---

## Mostrar HUD

```javascript
TutorialHUD.show();
```

---

## Ocultar HUD

```javascript
TutorialHUD.hide();
```

---

## Iniciar HUD

```javascript
TutorialHUD.start();
```

Inicia a HUD sem executar automaticamente a preparação das quests.

Útil para testes.

---

## Encerrar HUD

```javascript
TutorialHUD.end();
```

Desativa e oculta a interface.

---

# Etapas do tutorial

As etapas podem ser alteradas através de:

```javascript
TutorialHUD.step('ETAPA');
```

---

## Movimentação

```javascript
TutorialHUD.step('movement');
```

Exibe os controles direcionais.

```text
      ↑
   ←  ↓  →
```

As teclas respondem visualmente enquanto são pressionadas.

---

## Corrida

```javascript
TutorialHUD.step('run');
```

Apresenta:

```text
SHIFT
+
MOVIMENTO
```

---

## Interação

```javascript
TutorialHUD.step('interact');
```

Apresenta os controles utilizados para interagir:

```text
ENTER
ESPAÇO
Z
```

---

## Menu

```javascript
TutorialHUD.step('menu');
```

Apresenta:

```text
ESC
X
```

---

## Missões

```javascript
TutorialHUD.step('quests');
```

Instrui o jogador a acessar o Diário de Missões.

---

## Rastrear Quest Exemplo

```javascript
TutorialHUD.step('trackExample');
```

Instrui o jogador a rastrear:

```text
Quest Exemplo
```

Quando a integração com o Galv's Quest Log está ativa, o TutorialHUD consegue reconhecer o rastreamento realizado pelo próprio jogador.

---

## Voltar ao Tutorial

```javascript
TutorialHUD.step('trackTutorial');
```

Instrui o jogador a voltar a rastrear:

```text
Conclua o Tutorial
```

---

## Final

```javascript
TutorialHUD.step('finish');
```

Exibe a etapa final do tutorial.

---

# Texto personalizado

Também é possível substituir temporariamente o título e a instrução da HUD.

Exemplo:

```javascript
TutorialHUD.setText(
    'MOVIMENTAÇÃO',
    'Vá até a mesa indicada.'
);
```

---

# Última missão rastreada

Para consultar o ID da última missão detectada pelo TutorialHUD:

```javascript
TutorialHUD.lastTrackedQuest();
```

Exemplo:

```javascript
if (TutorialHUD.lastTrackedQuest() === 6) {
    // Quest Exemplo está sendo rastreada
}
```

---

# Plugin Commands

Também existem comandos que podem ser utilizados através de:

```text
Comando de Plugin
```

### Iniciar

```text
TUTORIALHUD START
```

### Preparar tutorial

```text
TUTORIALHUD PREPARE
```

### Mostrar

```text
TUTORIALHUD SHOW
```

### Ocultar

```text
TUTORIALHUD HIDE
```

### Encerrar

```text
TUTORIALHUD END
```

### Alterar etapa

```text
TUTORIALHUD STEP movement
```

Exemplos:

```text
TUTORIALHUD STEP run
TUTORIALHUD STEP interact
TUTORIALHUD STEP menu
TUTORIALHUD STEP quests
TUTORIALHUD STEP trackExample
TUTORIALHUD STEP trackTutorial
TUTORIALHUD STEP finish
```

---

# Integração com Galv's Quest Log

Uma das principais funcionalidades do TutorialHUD é acompanhar o rastreamento realizado pelo próprio jogador dentro da interface do Galv's Quest Log.

Por exemplo, durante o tutorial:

```text
Conclua o Tutorial
        ↓
Rastreie outra missão
        ↓
Jogador abre o QuestLog
        ↓
Jogador seleciona "Quest Exemplo"
        ↓
TutorialHUD detecta a alteração
```

Depois, o plugin pode solicitar:

```text
Volte a rastrear "Conclua o Tutorial"
```

permitindo verificar se o jogador realmente aprendeu como utilizar o sistema.

---

# Uso com MissaoHUD

O TutorialHUD foi desenvolvido para poder permanecer ativo simultaneamente ao **MissaoHUD**.

A disposição planejada é:

```text
TutorialHUD                         MissaoHUD

┌────────────────────────┐         ┌────────────────────┐
│ TUTORIAL               │         │ MISSÃO ATUAL       │
│                        │         │ Conclua o Tutorial │
│ Use as teclas...       │         │                    │
│                        │         │ • Aprenda a andar  │
│       [ ↑ ]            │         └────────────────────┘
│    [←][↓][→]           │
└────────────────────────┘

Canto superior esquerdo             Canto superior direito
```

O TutorialHUD explica **como realizar uma ação**, enquanto o MissaoHUD continua apresentando o **objetivo atual da missão**.

---

# Missões utilizadas no tutorial

A implementação original do projeto Missão UAI utiliza:

```text
Quest 5
Conclua o Tutorial
```

e:

```text
Quest 6
Quest Exemplo
```

A Quest Exemplo existe apenas para permitir que o jogador pratique o sistema de rastreamento sem precisar alterar uma missão real da história.

---

# Fluxo planejado

```text
Introdução
    ↓
Deseja realizar o tutorial?
    ↓
TutorialHUD
    ↓
Movimentação
    ↓
Corrida
    ↓
Interação
    ↓
Menu
    ↓
Missões
    ↓
Rastrear Quest Exemplo
    ↓
Rastrear novamente o Tutorial
    ↓
Tutorial concluído
    ↓
Início normal do jogo
```

---

# Roadmap

## v0.1.0

- [x] Estrutura inicial da HUD
- [x] HUD no canto superior esquerdo
- [x] Detecção das teclas direcionais
- [x] Feedback visual das teclas pressionadas
- [x] Etapa de movimentação
- [x] Etapa de corrida
- [x] Etapa de interação
- [x] Etapa de menu
- [x] Etapa de missões
- [x] Integração inicial com Galv's Quest Log
- [x] Detecção de missão rastreada
- [x] Compatibilidade planejada com MissaoHUD

---

## Próximas versões

- [ ] adicionar opção **Controles** ao menu;
- [ ] permitir visualizar os controles fora do tutorial;
- [ ] adicionar esquema de movimentação por **WASD**;
- [ ] permitir alternar entre **Setas** e **WASD**;
- [ ] salvar preferência do jogador;
- [ ] adicionar configuração através do `ConfigManager`;
- [ ] melhorar animações da HUD;
- [ ] adicionar transições suaves entre etapas;
- [ ] melhorar feedback visual de conclusão;
- [ ] estudar suporte a remapeamento personalizado de teclas;
- [ ] ampliar integração com sistemas de tutorial baseados em eventos.

---

# Estado do projeto

O TutorialHUD ainda está em desenvolvimento.

A API, parâmetros e funcionamento interno podem sofrer alterações durante as próximas versões.

A versão atual foi criada inicialmente para testes dentro do projeto **Missão UAI**.

---

# Autor

**Gustavo Pestana**

Projeto desenvolvido para RPG Maker MV como parte do desenvolvimento do jogo educacional **Missão UAI**.