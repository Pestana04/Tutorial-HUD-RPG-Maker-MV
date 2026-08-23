# TutorialHUD — RPG Maker MV

Plugin desenvolvido para adicionar uma **interface interativa de tutorial e consulta permanente de controles** ao RPG Maker MV.

O projeto foi criado originalmente para o jogo educacional **Missão UAI**, desenvolvido como Trabalho de Conclusão de Curso.

O objetivo do TutorialHUD é facilitar a adaptação de jogadores que não possuem experiência prévia com jogos desenvolvidos no RPG Maker MV.

---

## Versão atual

**v0.2.0**

Versão em desenvolvimento e testes.

A versão 0.2.0 expande o plugin para além do mapa de tutorial, adicionando uma tela permanente de **Controles** acessível pelo menu do jogo.

---

# Funcionalidades

O TutorialHUD atualmente possui:

- HUD interativa no canto superior esquerdo;
- instruções diferentes para cada etapa;
- representação visual das teclas;
- reação visual às teclas pressionadas;
- tutorial de movimentação;
- tutorial de corrida;
- tutorial de interação;
- tutorial do menu;
- tutorial do sistema de missões;
- integração com Galv's Quest Log;
- integração com MissaoHUD;
- Quest Exemplo;
- detecção automática do rastreamento de missões;
- conclusão silenciosa da Quest Exemplo;
- opção `Controles` no menu;
- tela permanente para consulta dos controles;
- desbloqueio da tela através do switch `Tutorial Completo`.

---

# Dependências

Para utilização completa:

```text
RPG Maker MV
Galv's Quest Log
MissaoHUD
```

O projeto Missão UAI também utiliza `AltMenuScreen`.

---

# Ordem recomendada dos plugins

```text
AltMenuScreen
...
Galv_QuestLog
MissaoHUD
TutorialHUD
```

O TutorialHUD deve permanecer abaixo do Galv's Quest Log, MissaoHUD e de plugins que alterem o menu.

---

# Instalação

Copie:

```text
TutorialHUD.js
```

para:

```text
SeuProjeto/
└── js/
    └── plugins/
        └── TutorialHUD.js
```

Depois abra:

```text
RPG Maker MV
→ Ferramentas
→ Gerenciador de Plugins
```

adicione:

```text
TutorialHUD
```

e defina:

```text
Status: ON
```

---

# Switch Tutorial Completo

O TutorialHUD utiliza apenas um switch externo para controlar o desbloqueio permanente da opção `Controles`.

No projeto Missão UAI:

```text
Tutorial Completo
```

Configure o parâmetro:

```text
SwitchTutorialCompleto
```

para esse switch.

Exemplo:

```text
#0029 Tutorial Completo
```

---

# Funcionamento do switch

Antes da decisão:

```text
Tutorial Completo = OFF
```

Se o jogador escolher realizar o tutorial:

```text
Tutorial Completo permanece OFF
```

até o tutorial ser concluído.

Quando terminar:

```text
Tutorial Completo = ON
```

Se o jogador recusar o tutorial:

```text
Tutorial Completo = ON
```

imediatamente.

Portanto o switch representa que o tutorial não está mais pendente.

---

# Preparar tutorial

A partir da versão 0.2.0, recomenda-se iniciar o tutorial com:

```javascript
TutorialHUD.prepare();
```

Esse comando executa automaticamente:

```text
Ativa Quest 5
        ↓
Ativa primeiro objetivo
        ↓
Esconde objetivos seguintes
        ↓
Ativa Quest 6
        ↓
Ativa objetivo da Quest Exemplo
        ↓
Rastreia Quest 5
        ↓
Inicia TutorialHUD
```

---

# Quest 5

A implementação original utiliza:

```text
Quest 5 — Conclua o Tutorial
```

Objetivos:

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

---

# Quest 6

A Quest Exemplo utiliza:

```text
Quest 6 — Quest Exemplo
```

Objetivo:

```text
0 - Rastreie essa missão
```

Essa missão existe exclusivamente para ensinar ao jogador como alterar uma missão rastreada.

---

# Etapas da HUD

## Movimentação

```javascript
TutorialHUD.step('movement');
```

---

## Corrida

```javascript
TutorialHUD.step('run');
```

---

## Interação

```javascript
TutorialHUD.step('interact');
```

---

## Menu

```javascript
TutorialHUD.step('menu');
```

---

## Missões

```javascript
TutorialHUD.step('quests');
```

---

## Rastrear Quest Exemplo

```javascript
TutorialHUD.step('trackExample');
```

---

## Rastrear Tutorial

```javascript
TutorialHUD.step('trackTutorial');
```

---

## Final

```javascript
TutorialHUD.step('finish');
```

---

# Rastreamento de missões

O TutorialHUD acompanha:

```javascript
Galv.QUEST.track(id);
```

Quando o jogador rastreia:

```text
Quest Exemplo
```

o plugin automaticamente considera concluídos:

```text
✓ Abra as Missões
✓ Rastreie outra missão
```

e ativa:

```text
• Rastreie o tutorial
```

---

# Quest Exemplo silenciosa

Ao concluir sua função didática, a Quest Exemplo é finalizada através de:

```javascript
MissaoHUD.silentComplete(6);
```

Isso evita exibir:

```text
MISSÃO CONCLUÍDA
Quest Exemplo
```

Caso o método não esteja disponível, o TutorialHUD utiliza o Galv's Quest Log como fallback.

---

# Integração com MissaoHUD

Durante o tutorial:

```text
TutorialHUD                       MissaoHUD

┌─────────────────────┐           ┌─────────────────────┐
│ MOVIMENTAÇÃO        │           │ MISSÃO ATUAL        │
│                     │           │ Conclua o Tutorial │
│ Use as teclas...    │           │ • Aprenda a andar  │
│                     │           └─────────────────────┘
│      [ ↑ ]          │
│   [←][↓][→]         │
└─────────────────────┘
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

# Opção Controles

A versão 0.2.0 adiciona:

```text
Controles
```

ao menu do RPG Maker MV.

A opção só aparece quando:

```text
Tutorial Completo = ON
```

---

# Tela de Controles

Ao selecionar:

```text
Controles
```

o jogador acessa uma tela contendo:

```text
CONTROLES

Movimentação
      ↑
   ←  ↓  →

Correr
SHIFT + direção

Interagir / Confirmar
ENTER / ESPAÇO / Z

Menu / Voltar
ESC / X

Missões
Menu → Missões
```

Para voltar:

```text
ESC
```

ou:

```text
X
```

---

# Abrir Controles via Script

Também é possível abrir diretamente:

```javascript
TutorialHUD.openControls();
```

---

# Plugin Command

Também existe:

```text
TUTORIALHUD CONTROLS
```

---

# Outros Script Calls

## Preparar

```javascript
TutorialHUD.prepare();
```

## Iniciar

```javascript
TutorialHUD.start();
```

## Mostrar

```javascript
TutorialHUD.show();
```

## Ocultar

```javascript
TutorialHUD.hide();
```

## Encerrar

```javascript
TutorialHUD.end();
```

## Última missão rastreada

```javascript
TutorialHUD.lastTrackedQuest();
```

## Texto personalizado

```javascript
TutorialHUD.setText(
    'TÍTULO',
    'Mensagem personalizada'
);
```

---

# Fluxo do Missão UAI

```text
Introdução
      ↓
Deseja realizar tutorial?
      ↓
 ┌────┴────┐
 │         │
SIM       NÃO
 │         │
 │         └── Tutorial Completo = ON
 │
TutorialHUD.prepare()
 │
Tutorial
 │
Movimentação
 │
Corrida
 │
Interação
 │
Menu
 │
Missões
 │
Quest Exemplo
 │
Voltar ao Tutorial
 │
Missão Concluída
 │
TutorialHUD.end()
 │
Tutorial Completo = ON
 │
 └──────────────┐
                ↓
           Apartamento
                ↓
              Menu
                ↓
            Controles
```

---

# Histórico de versões

## v0.2.0

### Adicionado

- opção `Controles` no menu;
- Scene exclusiva para consulta de controles;
- interface gráfica dos controles;
- parâmetro `SwitchTutorialCompleto`;
- parâmetro para nome do comando;
- Script Call `TutorialHUD.openControls()`;
- Plugin Command `TUTORIALHUD CONTROLS`.

### Alterado

- sistema passa a utilizar apenas o switch externo `Tutorial Completo`;
- documentação de instalação;
- documentação de integração;
- fluxo do tutorial.

---

## v0.1.1

### Adicionado

- conclusão automática de `Abra as Missões`;
- integração com `MissaoHUD.silentComplete()`;
- conclusão silenciosa da Quest Exemplo.

---

## v0.1.0

Primeira versão.

### Adicionado

- HUD de tutorial;
- movimentação;
- corrida;
- interação;
- menu;
- missões;
- feedback visual das teclas;
- integração com Galv's Quest Log.

---

# Roadmap

## v0.2.0

- [x] HUD interativa;
- [x] movimentação;
- [x] corrida;
- [x] interação;
- [x] menu;
- [x] Quest Log;
- [x] Quest Exemplo;
- [x] integração com MissaoHUD;
- [x] opção Controles;
- [x] tela permanente de controles;
- [x] desbloqueio por switch;
- [ ] validação completa dentro do RPG Maker MV.

## Futuro

- [ ] suporte a WASD;
- [ ] troca Setas ↔ WASD;
- [ ] armazenamento da preferência;
- [ ] remapeamento de teclas;
- [ ] interface para configuração individual;
- [ ] animações da tela de controles;
- [ ] ícones aprimorados;
- [ ] suporte a gamepad.

---

# Estado do projeto

A versão:

```text
v0.2.0
```

está em fase de testes dentro do projeto Missão UAI.

---

# Autor

**Gustavo Pestana**

Plugin desenvolvido para RPG Maker MV como parte do jogo educacional **Missão UAI**.