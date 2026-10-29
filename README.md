# TutorialHUD — RPG Maker MV

Plugin desenvolvido para adicionar uma **interface interativa de tutorial, acompanhamento de controles e personalização da movimentação** ao RPG Maker MV.

O projeto foi criado originalmente para o jogo educacional **Missão UAI — Passaporte**, desenvolvido como Trabalho de Conclusão de Curso de Sistemas de Informação.

O objetivo do TutorialHUD é facilitar a adaptação de jogadores que não possuem experiência prévia com jogos desenvolvidos no RPG Maker MV, oferecendo instruções interativas e uma interface permanente de consulta e configuração de controles.

---

## Versão atual

**v0.3.0 — Personalização de Controles**

A versão 0.3.0 introduz a possibilidade de alternar entre **SETAS e WASD**, armazenando a preferência do jogador e impedindo alterações enquanto o tutorial está em execução.

O plugin continua utilizando apenas um arquivo JavaScript, preservando todas as funcionalidades implementadas nas versões anteriores.

**Estado:** implementação disponível, aguardando validação completa da versão 0.3.0 no RPG Maker MV.

---

## Funcionalidades

O TutorialHUD possui:

- HUD interativa no canto superior esquerdo;
- instruções específicas para cada etapa do tutorial;
- representação visual das teclas;
- feedback visual em tempo real das teclas pressionadas;
- tutorial de movimentação, corrida e interação;
- tutorial de utilização do menu;
- tutorial de rastreamento de missões;
- integração com Galv's Quest Log;
- integração com MissaoHUD;
- detecção do rastreamento de missões;
- Quest Exemplo para treinamento;
- conclusão silenciosa da Quest Exemplo;
- opção **Controles** no menu principal;
- tela permanente de consulta dos controles;
- alternância entre SETAS e WASD;
- armazenamento persistente da preferência;
- bloqueio da alternância durante o tutorial;
- desbloqueio da configuração pelo switch `Tutorial Completo`.

---

## Dependências

Para utilização completa:

- RPG Maker MV;
- Galv's Quest Log;
- MissaoHUD.

O projeto Missão UAI também utiliza `AltMenuScreen` para personalização do menu.

### Ordem recomendada dos plugins

```text
AltMenuScreen
...
Galv_QuestLog
MissaoHUD
TutorialHUD
```

O TutorialHUD deve permanecer abaixo do Galv's Quest Log, MissaoHUD e dos plugins que modificam o menu.

**Não é necessário instalar plugins adicionais para a funcionalidade WASD.**

---

## Instalação

Copie o arquivo:

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

No RPG Maker MV:

1. Acesse Ferramentas → Gerenciador de Plugins.
2. Adicione `TutorialHUD`.
3. Defina o status como `ON`.
4. Configure os parâmetros de acordo com seu projeto.

Para atualizar da versão 0.2.0 para a 0.3.0, mantenha o mesmo nome de arquivo.

---

## Parâmetros principais

| Parâmetro | Finalidade |
|---|---|
| Largura | Largura da HUD de tutorial |
| Altura | Altura da HUD |
| Margem | Distância da HUD às bordas |
| OpacidadeFundo | Opacidade do fundo |
| CorDestaque | Cor utilizada nos elementos visuais |
| TutorialQuestId | ID da missão do tutorial |
| QuestExemploId | ID da missão de exemplo |
| IntegracaoQuestLog | Integração com Galv's Quest Log |
| SwitchTutorialCompleto | Switch responsável pelo desbloqueio dos controles |
| NomeComandoControles | Nome da opção adicionada ao menu |

No projeto Missão UAI:

```text
TutorialQuestId = 5
QuestExemploId = 6
IntegracaoQuestLog = true
SwitchTutorialCompleto = 29
NomeComandoControles = Controles
```

---

# Sistema de Tutorial

## Preparação

O tutorial pode ser preparado automaticamente pelo comando:

```javascript
TutorialHUD.prepare();
```

Esse método:

1. Inicia o TutorialHUD;
2. ativa a Quest 5;
3. ativa o primeiro objetivo;
4. oculta os objetivos seguintes;
5. ativa a Quest 6;
6. ativa o objetivo da Quest Exemplo;
7. rastreia a Quest 5.

### Missões utilizadas

**Quest 5 — Conclua o Tutorial**

```text
0 - Vá até o círculo
1 - Aprenda a correr
2 - Interaja com o livro
3 - Abra o menu
4 - Abra as Missões
5 - Rastreie outra missão
6 - Rastreie o tutorial
7 - Conclua o Tutorial
```

**Quest 6 — Quest Exemplo**

```text
0 - Rastreie esta missão
```

A Quest Exemplo possui finalidade exclusivamente didática, permitindo que o jogador aprenda a alterar a missão rastreada.

---

## Etapas do TutorialHUD

### Movimentação

```javascript
TutorialHUD.step('movement');
```

Apresenta as setas direcionais e destaca visualmente os comandos pressionados.

### Corrida

```javascript
TutorialHUD.step('run');
```

Ensina a utilizar SHIFT enquanto o personagem se movimenta.

### Interação

```javascript
TutorialHUD.step('interact');
```

Orienta o jogador a interagir com objetos e eventos.

### Menu

```javascript
TutorialHUD.step('menu');
```

Apresenta o acesso ao menu do jogo.

### Missões

```javascript
TutorialHUD.step('quests');
```

Ensina como acessar o Diário de Missões.

### Rastrear Quest Exemplo

```javascript
TutorialHUD.step('trackExample');
```

Solicita ao jogador que rastreie a missão de exemplo.

### Rastrear Tutorial

```javascript
TutorialHUD.step('trackTutorial');
```

Orienta o jogador a retornar ao rastreamento do tutorial.

### Finalização

```javascript
TutorialHUD.step('finish');
```

Exibe a última etapa do tutorial.

---

## Integração com Galv's Quest Log

O plugin acompanha as alterações realizadas pelo sistema de rastreamento:

```javascript
Galv.QUEST.track(id);
```

Ao rastrear a Quest Exemplo, o TutorialHUD identifica a mudança e atualiza os objetivos correspondentes.

Quando a Quest Exemplo conclui sua função didática, pode ser finalizada silenciosamente por meio de:

```javascript
MissaoHUD.silentComplete(6);
```

Isso evita apresentar notificações de conclusão desnecessárias ao jogador.

Caso o método não esteja disponível, o plugin utiliza o Galv's Quest Log como alternativa.

---

## Integração com MissaoHUD

Os plugins possuem funções complementares.

**TutorialHUD:** explica como realizar uma ação.

**MissaoHUD:** informa qual objetivo deve ser realizado.

Durante o tutorial, os dois permanecem visíveis simultaneamente, em posições diferentes.

```text
TutorialHUD                   MissaoHUD

┌────────────────────┐        ┌─────────────────────┐
│ MOVIMENTAÇÃO       │        │ MISSÃO ATUAL        │
│                    │        │ Conclua o Tutorial │
│ Use as teclas      │        │                     │
│ indicadas...       │        │ • Vá até o círculo  │
│                    │        └─────────────────────┘
│      [ ↑ ]         │
│   [←][↓][→]        │
└────────────────────┘
```

---

# Sistema de Controles — v0.3.0

A versão 0.3.0 permite personalizar as teclas de movimentação após o tutorial.

## Modos disponíveis

**Modo SETAS**

```text
      ↑
   ←  ↓  →
```

**Modo WASD**

```text
      W
   A  S  D
```

As setas direcionais continuam disponíveis mesmo quando WASD está ativado.

### Alternância

O jogador acessa:

```text
Menu → Controles
```

e pressiona:

```text
ENTER / Z / ESPAÇO
```

para alternar entre os modos.

A interface atualiza automaticamente a representação visual das teclas.

### Demais controles

| Ação | Teclas |
|---|---|
| Correr | SHIFT + direção |
| Interagir / Confirmar | ENTER, ESPAÇO ou Z |
| Menu / Voltar | ESC ou X |
| Acessar missões | Menu → Missões |

---

## Bloqueio durante o tutorial

Para evitar confusões durante as instruções iniciais, o jogador não poderá alterar o esquema de movimentação enquanto o tutorial estiver ativo.

O tutorial permanece utilizando as **setas direcionais**, independentemente da preferência anteriormente salva.

A alternância é liberada quando:

```text
Tutorial Completo = ON
```

e a HUD interativa do tutorial não está em execução visível.

Esse funcionamento garante consistência entre as instruções apresentadas e os comandos utilizados pelo jogador.

---

## Switch Tutorial Completo

O projeto utiliza:

```text
#0029 Tutorial Completo
```

O switch controla tanto a liberação da opção `Controles` quanto a disponibilidade da alternância SETAS/WASD.

### Jogador escolhe realizar o tutorial

```text
Tutorial Completo = OFF
        ↓
Início do tutorial
        ↓
TutorialHUD ativo
        ↓
Conclusão das etapas
        ↓
TutorialHUD.end()
        ↓
Tutorial Completo = ON
        ↓
Menu Controles disponível
```

### Jogador recusa o tutorial

```text
Tutorial Completo = ON
        ↓
Jogo principal
        ↓
Menu Controles disponível
```

Não é necessário criar outro switch.

---

## Armazenamento das preferências

A escolha entre SETAS e WASD é registrada pelo `ConfigManager` do RPG Maker MV.

Exemplo:

```javascript
ConfigManager.tutorialMovementMode
```

Valores possíveis:

```javascript
'arrows'
'wasd'
```

A preferência é salva automaticamente após a alternância.

O armazenamento é realizado nas configurações gerais do jogo, permitindo manter o modo escolhido após fechar e reabrir a aplicação.

**Importante:** a preferência é global à instalação do jogo, e não individual por arquivo de save.

---

## Compatibilidade com novos jogos

Mesmo que o jogador tenha utilizado WASD anteriormente, iniciar um novo jogo com o switch `Tutorial Completo` desligado mantém a movimentação pelas setas durante o tutorial.

Após concluir ou dispensar o tutorial, o plugin pode aplicar novamente a preferência armazenada.

---

## Tela de Controles

A interface permanente apresenta:

```text
CONTROLES

Movimentação - SETAS

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

ENTER / Z / ESPAÇO: alternar
ESC / X: voltar
```

Quando WASD estiver selecionado:

```text
Movimentação - WASD

       W
    A  S  D
```

A tela é atualizada sem necessidade de reiniciar o jogo.

---

# Script Calls

## Preparar o tutorial

```javascript
TutorialHUD.prepare();
```

## Iniciar a HUD

```javascript
TutorialHUD.start();
```

## Mostrar a HUD

```javascript
TutorialHUD.show();
```

## Ocultar a HUD

```javascript
TutorialHUD.hide();
```

## Encerrar a HUD

```javascript
TutorialHUD.end();
```

## Alterar etapa

```javascript
TutorialHUD.step('movement');
TutorialHUD.step('run');
TutorialHUD.step('interact');
TutorialHUD.step('menu');
TutorialHUD.step('quests');
TutorialHUD.step('trackExample');
TutorialHUD.step('trackTutorial');
TutorialHUD.step('finish');
```

## Texto personalizado

```javascript
TutorialHUD.setText(
    'TÍTULO',
    'Mensagem personalizada'
);
```

## Consultar última missão rastreada

```javascript
TutorialHUD.lastTrackedQuest();
```

## Abrir tela de controles

```javascript
TutorialHUD.openControls();
```

## Consultar modo de movimentação efetivo

```javascript
TutorialHUD.effectiveMovementMode();
```

Retorna `arrows` ou `wasd`, considerando o bloqueio do tutorial.

## Verificar disponibilidade da alternância

```javascript
TutorialHUD.canChangeMovement();
```

Retorna `true` ou `false`.

## Alternar SETAS/WASD

```javascript
TutorialHUD.toggleMovementMode();
```

Alterna o modo quando permitido e salva a preferência.

## Reaplicar os controles

```javascript
TutorialHUD.applyMovementMode();
```

Reaplica o mapeamento considerando a configuração e o estado do tutorial.

---

# Plugin Commands

Para abrir a tela de controles:

```text
TUTORIALHUD CONTROLS
```

O comando mantém compatibilidade com a funcionalidade introduzida na versão 0.2.0.

---

# Fluxo do Missão UAI

```text
INTRODUÇÃO
     │
     ▼
DESEJA REALIZAR O TUTORIAL?
     │
 ┌───┴────┐
 │        │
SIM      NÃO
 │        │
 ▼        ▼
TUTORIAL  Tutorial Completo = ON
 │        │
 ▼        │
MOVIMENTAÇÃO
 │        │
 ▼        │
CORRIDA   │
 │        │
 ▼        │
INTERAÇÃO │
 │        │
 ▼        │
MENU      │
 │        │
 ▼        │
MISSÕES   │
 │        │
 ▼        │
QUEST EXEMPLO
 │        │
 ▼        │
CONCLUSÃO │
 │        │
 ▼        │
Tutorial Completo = ON
 │        │
 └────┬───┘
      │
      ▼
JOGO PRINCIPAL
      │
      ▼
MENU → CONTROLES
      │
      ▼
SETAS ↔ WASD
      │
      ▼
PREFERÊNCIA SALVA
```

---

# Histórico de versões

## v0.3.0 — Personalização dos controles

**Adicionado:**

- alternância entre SETAS e WASD;
- configuração persistente de movimentação;
- integração com `ConfigManager`;
- atualização visual do modo selecionado;
- proteção contra alternância durante o tutorial;
- restauração das setas durante a execução do tutorial;
- reaplicação do modo ao entrar no mapa;
- novas funções para consultar e alterar o modo de movimentação.

**Mantido:**

- interface original do TutorialHUD;
- Quest Exemplo;
- integração com Galv's Quest Log;
- integração com MissaoHUD;
- tela permanente de controles;
- switch `Tutorial Completo`;
- compatibilidade com as etapas anteriores.

## v0.2.0 — Tela de Controles

**Adicionado:**

- opção `Controles` no menu;
- tela exclusiva para consulta;
- interface gráfica dos controles;
- parâmetro `SwitchTutorialCompleto`;
- parâmetro de nome do comando;
- Script Call `TutorialHUD.openControls()`;
- Plugin Command `TUTORIALHUD CONTROLS`.

## v0.1.1 — Integração de missões

**Adicionado:**

- conclusão automática de `Abra as Missões` ao rastrear a Quest Exemplo;
- integração com `MissaoHUD.silentComplete()`;
- conclusão silenciosa da Quest Exemplo;
- melhorias na progressão do tutorial.

## v0.1.0 — Primeira versão

**Adicionado:**

- HUD interativa;
- movimentação;
- corrida;
- interação;
- menu;
- missões;
- feedback visual das teclas;
- integração inicial com Galv's Quest Log.

---

# Roadmap

## Funcionalidades implementadas

- [x] HUD interativa;
- [x] representação de teclas;
- [x] feedback visual das teclas pressionadas;
- [x] tutorial de movimentação;
- [x] tutorial de corrida;
- [x] tutorial de interação;
- [x] tutorial do menu;
- [x] tutorial do Quest Log;
- [x] Quest Exemplo;
- [x] integração com MissaoHUD;
- [x] opção Controles no menu;
- [x] tela permanente de controles;
- [x] desbloqueio por switch;
- [x] implementação de alternância SETAS/WASD;
- [x] implementação de armazenamento das preferências;
- [x] implementação do bloqueio durante o tutorial.

## Validação pendente

- [ ] testar alternância durante o gameplay;
- [ ] verificar funcionamento de SHIFT + WASD;
- [ ] verificar persistência após reiniciar o jogo;
- [ ] validar novo jogo após salvar WASD;
- [ ] confirmar bloqueio durante todas as etapas do tutorial;
- [ ] verificar compatibilidade com o menu personalizado.

## Possíveis melhorias futuras

- [ ] remapeamento individual das teclas;
- [ ] suporte a gamepad;
- [ ] novas animações da interface;
- [ ] ampliação das configurações de acessibilidade.

---

# Estado do projeto

**TutorialHUD v0.3.0**

Desenvolvimento direcionado ao RPG Maker MV, com foco em acessibilidade de controles, orientação de jogadores iniciantes e integração ao sistema de missões.

A atualização 0.3.0 está preparada para testes de integração no Missão UAI.

---

# Autor

**Gustavo Zavon Pestana**

Desenvolvido para o projeto educacional **Missão UAI — Passaporte**, apresentado como Trabalho de Conclusão de Curso em Sistemas de Informação no Centro Universitário UniAcademia, Juiz de Fora — MG, 2026.

Desenvolvimento e integração realizados pelo autor com auxílio de ferramentas de inteligência artificial generativa.