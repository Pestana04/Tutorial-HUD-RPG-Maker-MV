# TutorialHUD — RPG Maker MV

Plugin desenvolvido para adicionar uma **interface interativa de tutorial** ao RPG Maker MV.

O projeto foi criado originalmente para o jogo educacional **Missão UAI**, desenvolvido como Trabalho de Conclusão de Curso.

O TutorialHUD tem como objetivo ajudar jogadores que não possuem experiência prévia com jogos desenvolvidos no RPG Maker, apresentando os controles e sistemas do jogo de maneira visual e interativa.

---

## Versão atual

**v0.1.1**

Versão atualmente em desenvolvimento e testes.

A versão 0.1.1 melhora a integração entre:

- TutorialHUD;
- MissaoHUD;
- Galv's Quest Log.

---

# Funcionalidades

Atualmente, o TutorialHUD possui:

- HUD no canto superior esquerdo;
- instruções diferentes para cada etapa do tutorial;
- representação visual das teclas;
- destaque em tempo real das teclas pressionadas;
- tutorial de movimentação;
- tutorial de corrida;
- tutorial de interação;
- tutorial de menu;
- tutorial do sistema de missões;
- integração com Galv's Quest Log;
- detecção de alterações no rastreamento de missões;
- integração com MissaoHUD;
- suporte a uma Quest Exemplo;
- detecção automática de que o jogador acessou o Quest Log;
- conclusão silenciosa da Quest Exemplo.

---

# Objetivo

Durante testes preliminares do jogo **Missão UAI**, jogadores que não possuíam familiaridade com RPG Maker MV demonstraram dificuldades para entender alguns dos controles.

O TutorialHUD foi criado para tornar esse processo mais intuitivo.

Em vez de simplesmente mostrar:

```text
Use as setas para andar.
```

o plugin apresenta:

```text
┌─────────────────────────────────┐
│ MOVIMENTAÇÃO                    │
│                                 │
│ Use as teclas para se mover.    │
│                                 │
│            [ ↑ ]                │
│         [←][↓][→]               │
│                                 │
└─────────────────────────────────┘
```

Ao pressionar uma tecla, sua representação muda visualmente.

---

# Dependências

Para utilizar todas as funcionalidades:

- RPG Maker MV;
- Galv's Quest Log;
- MissaoHUD.

---

# Ordem dos plugins

Utilize:

```text
Galv_QuestLog
MissaoHUD
TutorialHUD
```

O TutorialHUD deve permanecer abaixo dos outros dois.

Isso permite que ele acompanhe o sistema de rastreamento já modificado pelo MissaoHUD.

---

# Instalação

1. Baixe:

```text
TutorialHUD.js
```

2. Copie para:

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

6. Ative:

```text
ON
```

7. Confirme a ordem:

```text
Galv_QuestLog
MissaoHUD
TutorialHUD
```

---

# Parâmetros

## Largura

Largura da HUD.

Padrão:

```text
360
```

---

## Altura

Altura da HUD.

Padrão:

```text
190
```

---

## Margem

Distância em relação às bordas da tela.

Padrão:

```text
12
```

---

## OpacidadeFundo

Opacidade do fundo da HUD.

Padrão:

```text
190
```

---

## CorDestaque

Cor usada em:

- bordas;
- títulos;
- teclas pressionadas.

Padrão:

```text
#D99A4E
```

---

## TutorialQuestId

ID da missão principal do tutorial.

Padrão:

```text
5
```

---

## QuestExemploId

ID da missão utilizada para ensinar o rastreamento.

Padrão:

```text
6
```

---

## IntegracaoQuestLog

Habilita a integração automática com o Galv's Quest Log.

Padrão:

```text
true
```

---

# Missões usadas

A implementação original utiliza:

```text
Quest 5
Conclua o Tutorial
```

e:

```text
Quest 6
Quest Exemplo
```

---

# Objetivos da Quest 5

A estrutura atualmente utilizada é:

```text
0 - Aprenda a se movimentar
1 - Aprenda a correr
2 - Interaja com um objeto
3 - Abra o menu
4 - Abra as Missões
5 - Rastreie outra missão
6 - Rastreie o tutorial
7 - Conclua o Tutorial
```

Os índices começam em:

```text
0
```

---

# Quest Exemplo

A Quest Exemplo possui:

```text
0 - Rastreie essa missão
```

Ela existe exclusivamente para permitir que o jogador pratique a alteração da missão rastreada.

---

# Iniciar tutorial

O principal comando é:

```javascript
TutorialHUD.prepare();
```

Esse comando:

```text
Liga TutorialHUD
        ↓
Ativa Quest 5
        ↓
Ativa Quest 6
        ↓
Ativa objetivo 0 da Quest 5
        ↓
Esconde os demais objetivos
        ↓
Rastreia Quest 5
```

---

# Iniciar apenas a HUD

Para testes:

```javascript
TutorialHUD.start();
```

Isso não executa a preparação das quests.

---

# Mostrar

```javascript
TutorialHUD.show();
```

---

# Ocultar

```javascript
TutorialHUD.hide();
```

---

# Encerrar

```javascript
TutorialHUD.end();
```

Utilize quando o tutorial acabar.

---

# Etapas

Para alterar a etapa exibida:

```javascript
TutorialHUD.step('ETAPA');
```

---

## Movimentação

```javascript
TutorialHUD.step('movement');
```

Mostra:

```text
      ↑
   ←  ↓  →
```

As teclas reagem quando pressionadas.

---

## Corrida

```javascript
TutorialHUD.step('run');
```

Mostra:

```text
SHIFT + MOVIMENTO
```

---

## Interação

```javascript
TutorialHUD.step('interact');
```

Mostra:

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

Mostra:

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

Exibe:

```text
RASTREAR MISSÃO

Rastreie a missão "Quest Exemplo".
```

---

## Rastrear novamente o tutorial

```javascript
TutorialHUD.step('trackTutorial');
```

Exibe:

```text
RASTREAR MISSÃO

Volte a rastrear
"Conclua o Tutorial".
```

---

## Final

```javascript
TutorialHUD.step('finish');
```

Indica que todas as etapas didáticas foram realizadas.

---

# Detecção do rastreamento

Uma das principais funcionalidades do TutorialHUD é observar:

```javascript
Galv.QUEST.track(id);
```

Quando o jogador altera a missão rastreada através da própria interface do Galv's Quest Log, o TutorialHUD consegue detectar essa alteração.

---

# Fluxo do rastreamento

Durante o tutorial:

```text
Conclua o Tutorial
        ↓
Abra o Menu
        ↓
Abra Missões
        ↓
Rastreie Quest Exemplo
```

Quando:

```text
Quest Exemplo
```

é rastreada, a versão 0.1.1 realiza automaticamente:

```text
✓ Abra as Missões
✓ Rastreie outra missão
```

Isso acontece porque, se o jogador conseguiu rastrear outra missão, necessariamente conseguiu acessar o Quest Log.

Depois:

```text
• Rastreie o tutorial
```

é ativado.

---

# Alteração da v0.1.1

Na versão anterior, apenas:

```text
Rastreie outra missão
```

era marcado como concluído automaticamente.

Na versão 0.1.1, o plugin também conclui:

```text
Abra as Missões
```

quando a Quest Exemplo é rastreada.

Portanto:

```text
Jogador rastreia Quest Exemplo
        ↓
✓ Abra as Missões
        ↓
✓ Rastreie outra missão
        ↓
• Rastreie o tutorial
```

---

# Integração com MissaoHUD

O TutorialHUD foi projetado para funcionar ao mesmo tempo que o MissaoHUD.

Disposição:

```text
TutorialHUD                         MissaoHUD

┌────────────────────────┐         ┌────────────────────────┐
│ MOVIMENTAÇÃO           │         │ MISSÃO ATUAL           │
│                        │         │ Conclua o Tutorial     │
│ Use as teclas...       │         │ • Aprenda a correr    │
│                        │         └────────────────────────┘
│       [ ↑ ]            │
│    [←][↓][→]           │
└────────────────────────┘
```

O TutorialHUD explica:

```text
COMO
```

realizar a ação.

O MissaoHUD informa:

```text
O QUE
```

deve ser feito.

---

# Integração com MissaoHUD v0.3.0

O MissaoHUD v0.3.0 possui:

```javascript
MissaoHUD.silentComplete(id);
```

O TutorialHUD v0.1.1 utiliza essa função para concluir a Quest Exemplo.

Quando o jogador rastrear a Quest 6:

```text
Quest Exemplo
```

ela será concluída sem apresentar:

```text
MISSÃO CONCLUÍDA
Quest Exemplo
```

Isso evita dar destaque excessivo a uma missão criada exclusivamente para fins didáticos.

---

# Fallback

Caso o MissaoHUD não possua:

```javascript
MissaoHUD.silentComplete();
```

o TutorialHUD utiliza:

```javascript
Galv.QUEST.complete(
    exampleId,
    true
);
```

Assim, a Quest Exemplo continua sendo concluída sem solicitar o popup padrão do Galv.

---

# Retorno ao Tutorial

Depois que a Quest Exemplo for concluída, o jogador recebe a instrução:

```text
Volte a rastrear
"Conclua o Tutorial".
```

Quando isso acontecer:

```text
✓ Rastreie o tutorial
• Conclua o Tutorial
```

e o TutorialHUD muda para:

```javascript
TutorialHUD.step('finish');
```

---

# Última missão rastreada

É possível consultar:

```javascript
TutorialHUD.lastTrackedQuest();
```

Exemplo:

```javascript
if (TutorialHUD.lastTrackedQuest() === 6) {
    // Quest Exemplo foi rastreada
}
```

---

# Texto personalizado

Também é possível alterar manualmente o conteúdo:

```javascript
TutorialHUD.setText(
    'MOVIMENTAÇÃO',
    'Vá até o outro lado da sala.'
);
```

---

# Plugin Commands

Também estão disponíveis comandos tradicionais do RPG Maker MV.

## Preparar

```text
TUTORIALHUD PREPARE
```

---

## Iniciar

```text
TUTORIALHUD START
```

---

## Mostrar

```text
TUTORIALHUD SHOW
```

---

## Ocultar

```text
TUTORIALHUD HIDE
```

---

## Encerrar

```text
TUTORIALHUD END
```

---

## Alterar etapa

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

# Fluxo completo planejado

```text
Introdução
      ↓
Deseja realizar tutorial?
      ↓
TutorialHUD.prepare()
      ↓
Quest 5 ativa
Quest 6 ativa
      ↓
MOVIMENTAÇÃO
      ↓
CORRIDA
      ↓
INTERAÇÃO
      ↓
MENU
      ↓
MISSÕES
      ↓
RASTREIE QUEST EXEMPLO
      ↓
✓ Abra as Missões
✓ Rastreie outra missão
      ↓
Quest Exemplo concluída silenciosamente
      ↓
RASTREIE O TUTORIAL
      ↓
✓ Rastreie o tutorial
      ↓
CONCLUA O TUTORIAL
      ↓
Tutorial concluído
```

---

# Histórico de versões

## v0.1.1

### Adicionado

- conclusão automática do objetivo `Abra as Missões` ao rastrear a Quest Exemplo;
- integração com `MissaoHUD.silentComplete()`;
- fallback de conclusão silenciosa através do Galv's Quest Log;
- documentação do fluxo de integração.

### Alterado

- fluxo de rastreamento da Quest Exemplo;
- documentação;
- comentários internos do plugin.

---

## v0.1.0

Primeira versão.

### Adicionado

- HUD interativa;
- teclas direcionais;
- feedback visual de entrada;
- etapa de corrida;
- etapa de interação;
- etapa de menu;
- etapa de missões;
- integração com Galv's Quest Log;
- detecção do rastreamento de quests;
- suporte ao MissaoHUD.

---

# Roadmap

## v0.1.1

- [x] HUD básica;
- [x] movimentação;
- [x] corrida;
- [x] interação;
- [x] menu;
- [x] missões;
- [x] Quest Exemplo;
- [x] detecção do rastreamento;
- [x] detectar implicitamente acesso ao Quest Log;
- [x] integração com MissaoHUD;
- [x] conclusão silenciosa da Quest Exemplo;
- [ ] teste completo do tutorial dentro do RPG Maker MV;
- [ ] validação completa do fluxo Quest 5 → Quest 6 → Quest 5.

---

## Próximas versões

- [ ] botão `Controles` no menu;
- [ ] suporte a WASD;
- [ ] alternância Setas ↔ WASD;
- [ ] salvar preferência de controles;
- [ ] remapeamento de teclas;
- [ ] animações de entrada e saída;
- [ ] transições suaves entre etapas;
- [ ] melhorias visuais;
- [ ] consulta dos controles fora do tutorial;
- [ ] maior integração com o menu do jogo.

---

# Estado do projeto

O TutorialHUD continua em desenvolvimento.

A versão:

```text
v0.1.1
```

deve ser considerada uma versão de testes até que todo o fluxo do mapa Tutorial seja validado.

---

# Autor

**Gustavo Pestana**

Plugin desenvolvido para RPG Maker MV como parte do desenvolvimento do jogo educacional **Missão UAI**.