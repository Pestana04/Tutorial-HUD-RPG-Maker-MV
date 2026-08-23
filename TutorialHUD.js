/*:
 * @plugindesc v0.2.0 - HUD interativa de tutorial e tela de controles para o projeto Missão UAI.
 * @author Gustavo Pestana
 *
 * @param Largura
 * @type number
 * @min 250
 * @default 360
 *
 * @param Altura
 * @type number
 * @min 120
 * @default 190
 *
 * @param Margem
 * @type number
 * @min 0
 * @default 12
 *
 * @param OpacidadeFundo
 * @type number
 * @min 0
 * @max 255
 * @default 190
 *
 * @param CorDestaque
 * @type string
 * @default #D99A4E
 *
 * @param TutorialQuestId
 * @type number
 * @default 5
 *
 * @param QuestExemploId
 * @type number
 * @default 6
 *
 * @param IntegracaoQuestLog
 * @type boolean
 * @default true
 *
 * @param SwitchTutorialCompleto
 * @type switch
 * @desc Switch que libera a opção "Controles" no menu.
 * @default 0
 *
 * @param NomeComandoControles
 * @type string
 * @default Controles
 *
 * @help
 * ============================================================================
 * TutorialHUD
 * ============================================================================
 *
 * Plugin criado para o projeto Missão UAI.
 *
 * Fornece:
 *
 * - HUD interativa de tutorial;
 * - representação visual dos controles;
 * - feedback das teclas pressionadas;
 * - integração com Galv's Quest Log;
 * - integração com MissaoHUD;
 * - detecção de rastreamento de missões;
 * - Quest Exemplo para ensinar rastreamento;
 * - opção "Controles" no menu;
 * - tela permanente de consulta dos controles.
 *
 * ============================================================================
 * ORDEM RECOMENDADA
 * ============================================================================
 *
 * AltMenuScreen
 * Galv_QuestLog
 * MissaoHUD
 * TutorialHUD
 *
 * TutorialHUD deve ficar abaixo dos plugins que alteram o menu e das
 * dependências de quests.
 *
 * ============================================================================
 * SWITCH
 * ============================================================================
 *
 * Configure o parâmetro:
 *
 * SwitchTutorialCompleto
 *
 * para o switch utilizado pelo projeto:
 *
 * Tutorial Completo
 *
 * Quando esse switch estiver ON, a opção "Controles" aparecerá no menu.
 *
 * ============================================================================
 * SCRIPT CALLS
 * ============================================================================
 *
 * TutorialHUD.prepare();
 *     Prepara as quests 5 e 6 e inicia o tutorial.
 *
 * TutorialHUD.start();
 *     Inicia somente a HUD.
 *
 * TutorialHUD.show();
 *     Mostra a HUD.
 *
 * TutorialHUD.hide();
 *     Esconde a HUD.
 *
 * TutorialHUD.end();
 *     Encerra a HUD.
 *
 * TutorialHUD.step('movement');
 * TutorialHUD.step('run');
 * TutorialHUD.step('interact');
 * TutorialHUD.step('menu');
 * TutorialHUD.step('quests');
 * TutorialHUD.step('trackExample');
 * TutorialHUD.step('trackTutorial');
 * TutorialHUD.step('finish');
 *
 * TutorialHUD.setText('Título', 'Texto');
 *
 * TutorialHUD.lastTrackedQuest();
 *
 * TutorialHUD.openControls();
 *     Abre diretamente a tela de controles.
 *
 * ============================================================================
 * CHANGELOG
 * ============================================================================
 *
 * v0.2.0
 * - Adicionada opção "Controles" ao menu.
 * - Adicionada Scene própria de controles.
 * - Opção liberada pelo switch Tutorial Completo.
 * - Mantida integração com Galv's Quest Log.
 * - Mantida integração com MissaoHUD.
 * - Mantida conclusão silenciosa da Quest Exemplo.
 *
 * v0.1.1
 * - "Abra as Missões" passa a ser concluído automaticamente ao rastrear
 *   a Quest Exemplo.
 * - Integração com MissaoHUD.silentComplete().
 *
 * v0.1.0
 * - Primeira versão.
 *
 * ============================================================================
 */

var Imported = Imported || {};
Imported.TutorialHUD = true;

var TutorialHUD = TutorialHUD || {};

(function() {

    "use strict";

    // ========================================================================
    // PARÂMETROS
    // ========================================================================

    var params = PluginManager.parameters('TutorialHUD');

    TutorialHUD.width =
        Number(params['Largura'] || 360);

    TutorialHUD.height =
        Number(params['Altura'] || 190);

    TutorialHUD.margin =
        Number(params['Margem'] || 12);

    TutorialHUD.backgroundOpacity =
        Number(params['OpacidadeFundo'] || 190);

    TutorialHUD.highlightColor =
        String(params['CorDestaque'] || '#D99A4E');

    TutorialHUD.tutorialQuestId =
        Number(params['TutorialQuestId'] || 5);

    TutorialHUD.exampleQuestId =
        Number(params['QuestExemploId'] || 6);

    TutorialHUD.questIntegration =
        String(params['IntegracaoQuestLog'] || 'true') === 'true';

    TutorialHUD.completeSwitch =
        Number(params['SwitchTutorialCompleto'] || 0);

    TutorialHUD.controlsCommandName =
        String(params['NomeComandoControles'] || 'Controles');


    // ========================================================================
    // GAME SYSTEM
    // ========================================================================

    var _TutorialHUD_GameSystem_initialize =
        Game_System.prototype.initialize;

    Game_System.prototype.initialize = function() {

        _TutorialHUD_GameSystem_initialize.call(this);

        this._tutorialHudActive = false;
        this._tutorialHudVisible = false;
        this._tutorialHudStep = 'movement';

        this._tutorialHudCustomTitle = '';
        this._tutorialHudCustomText = '';

        this._tutorialLastTrackedQuest = 0;

    };


    // ========================================================================
    // COMPATIBILIDADE COM SAVES
    // ========================================================================

    TutorialHUD.ensureData = function() {

        if (!$gameSystem) {
            return;
        }

        if ($gameSystem._tutorialHudActive === undefined) {
            $gameSystem._tutorialHudActive = false;
        }

        if ($gameSystem._tutorialHudVisible === undefined) {
            $gameSystem._tutorialHudVisible = false;
        }

        if (!$gameSystem._tutorialHudStep) {
            $gameSystem._tutorialHudStep = 'movement';
        }

        if ($gameSystem._tutorialHudCustomTitle === undefined) {
            $gameSystem._tutorialHudCustomTitle = '';
        }

        if ($gameSystem._tutorialHudCustomText === undefined) {
            $gameSystem._tutorialHudCustomText = '';
        }

        if ($gameSystem._tutorialLastTrackedQuest === undefined) {
            $gameSystem._tutorialLastTrackedQuest = 0;
        }

    };


    // ========================================================================
    // INICIAR HUD
    // ========================================================================

    TutorialHUD.start = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudActive = true;
        $gameSystem._tutorialHudVisible = true;
        $gameSystem._tutorialHudStep = 'movement';

        $gameSystem._tutorialHudCustomTitle = '';
        $gameSystem._tutorialHudCustomText = '';

        TutorialHUD.refresh();

    };


    // ========================================================================
    // PREPARAR TUTORIAL
    // ========================================================================

    TutorialHUD.prepare = function() {

        TutorialHUD.start();

        if (
            typeof Galv === 'undefined' ||
            !Galv.QUEST ||
            typeof Galv.QUEST.activate !== 'function'
        ) {

            console.warn(
                'TutorialHUD: Galv_QuestLog não encontrado.'
            );

            return;
        }

        var tutorialId =
            TutorialHUD.tutorialQuestId;

        var exampleId =
            TutorialHUD.exampleQuestId;


        // ATIVAR QUEST DO TUTORIAL

        Galv.QUEST.activate(
            tutorialId,
            true
        );


        // PRIMEIRO OBJETIVO

        Galv.QUEST.objective(
            tutorialId,
            0,
            'activate',
            true
        );


        // ESCONDER RESTANTE

        for (var i = 1; i <= 7; i++) {

            Galv.QUEST.objective(
                tutorialId,
                i,
                'hide',
                true
            );

        }


        // ATIVAR QUEST EXEMPLO

        Galv.QUEST.activate(
            exampleId,
            true
        );


        Galv.QUEST.objective(
            exampleId,
            0,
            'activate',
            true
        );


        // RASTREAR TUTORIAL

        Galv.QUEST.track(
            tutorialId
        );

    };


    // ========================================================================
    // MOSTRAR
    // ========================================================================

    TutorialHUD.show = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudVisible = true;

        TutorialHUD.refresh();

    };


    // ========================================================================
    // ESCONDER
    // ========================================================================

    TutorialHUD.hide = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudVisible = false;

        TutorialHUD.refresh();

    };


    // ========================================================================
    // ENCERRAR
    // ========================================================================

    TutorialHUD.end = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudActive = false;
        $gameSystem._tutorialHudVisible = false;

        TutorialHUD.refresh();

    };


    // ========================================================================
    // ALTERAR ETAPA
    // ========================================================================

    TutorialHUD.step = function(step) {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudStep =
            String(step);

        $gameSystem._tutorialHudCustomTitle = '';
        $gameSystem._tutorialHudCustomText = '';

        TutorialHUD.refresh();

    };


    // ========================================================================
    // TEXTO PERSONALIZADO
    // ========================================================================

    TutorialHUD.setText = function(title, text) {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudCustomTitle =
            String(title || '');

        $gameSystem._tutorialHudCustomText =
            String(text || '');

        TutorialHUD.refresh();

    };


    // ========================================================================
    // ÚLTIMA QUEST RASTREADA
    // ========================================================================

    TutorialHUD.lastTrackedQuest = function() {

        TutorialHUD.ensureData();

        return Number(
            $gameSystem._tutorialLastTrackedQuest || 0
        );

    };


    // ========================================================================
    // REFRESH
    // ========================================================================

    TutorialHUD.refresh = function() {

        if (
            SceneManager._scene &&
            SceneManager._scene._tutorialHudWindow
        ) {

            SceneManager._scene
                ._tutorialHudWindow
                .refresh();

        }

    };


    // ========================================================================
    // TEXTOS DAS ETAPAS
    // ========================================================================

    TutorialHUD.stepData = function(step) {

        switch (step) {

            case 'movement':

                return {
                    title: 'MOVIMENTAÇÃO',
                    text: 'Use as teclas indicadas para se movimentar.'
                };


            case 'run':

                return {
                    title: 'CORRER',
                    text: 'Segure SHIFT enquanto se movimenta.'
                };


            case 'interact':

                return {
                    title: 'INTERAÇÃO',
                    text: 'Fique de frente para o objeto e interaja.'
                };


            case 'menu':

                return {
                    title: 'MENU',
                    text: 'Abra o menu do jogo.'
                };


            case 'quests':

                return {
                    title: 'MISSÕES',
                    text: 'Abra o Diário de Missões pelo menu.'
                };


            case 'trackExample':

                return {
                    title: 'RASTREAR MISSÃO',
                    text: 'Rastreie a missão "Quest Exemplo".'
                };


            case 'trackTutorial':

                return {
                    title: 'RASTREAR MISSÃO',
                    text: 'Volte a rastrear "Conclua o Tutorial".'
                };


            case 'finish':

                return {
                    title: 'TUTORIAL',
                    text: 'Muito bem! Você concluiu as etapas.'
                };


            default:

                return {
                    title: 'TUTORIAL',
                    text: ''
                };

        }

    };


    // ========================================================================
    // WINDOW TUTORIAL HUD
    // ========================================================================

    function Window_TutorialHUD() {

        this.initialize.apply(
            this,
            arguments
        );

    }


    Window_TutorialHUD.prototype =
        Object.create(
            Window_Base.prototype
        );


    Window_TutorialHUD.prototype.constructor =
        Window_TutorialHUD;


    Window_TutorialHUD.prototype.initialize =
        function() {

            var x =
                TutorialHUD.margin;

            var y =
                TutorialHUD.margin;

            Window_Base.prototype.initialize.call(
                this,
                x,
                y,
                TutorialHUD.width,
                TutorialHUD.height
            );

            this.opacity = 0;
            this.backOpacity = 0;

            this._lastInputSignature = '';

            this.refresh();

        };


    // ========================================================================
    // UPDATE HUD
    // ========================================================================

    Window_TutorialHUD.prototype.update =
        function() {

            Window_Base.prototype.update.call(this);

            TutorialHUD.ensureData();

            this.visible =
                $gameSystem._tutorialHudActive &&
                $gameSystem._tutorialHudVisible;

            if (!this.visible) {
                return;
            }

            var signature =
                this.inputSignature();

            if (
                signature !==
                this._lastInputSignature
            ) {

                this._lastInputSignature =
                    signature;

                this.refresh();

            }

        };


    // ========================================================================
    // INPUT
    // ========================================================================

    Window_TutorialHUD.prototype.inputSignature =
        function() {

            return [

                Input.isPressed('up'),
                Input.isPressed('down'),
                Input.isPressed('left'),
                Input.isPressed('right'),

                Input.isPressed('shift'),
                Input.isPressed('ok'),
                Input.isPressed('cancel'),

                $gameSystem._tutorialHudStep

            ].join('|');

        };


    // ========================================================================
    // REFRESH HUD
    // ========================================================================

    Window_TutorialHUD.prototype.refresh =
        function() {

            if (!this.contents) {
                return;
            }

            this.contents.clear();

            TutorialHUD.ensureData();

            this.visible =
                $gameSystem._tutorialHudActive &&
                $gameSystem._tutorialHudVisible;

            if (!this.visible) {
                return;
            }

            this.drawBackground();

            var step =
                $gameSystem._tutorialHudStep;

            var data =
                TutorialHUD.stepData(step);

            var title =
                $gameSystem._tutorialHudCustomTitle ||
                data.title;

            var text =
                $gameSystem._tutorialHudCustomText ||
                data.text;


            this.drawHeader(title);

            this.drawInstruction(text);

            this.drawControls(step);

        };


    // ========================================================================
    // FUNDO HUD
    // ========================================================================

    Window_TutorialHUD.prototype.drawBackground =
        function() {

            var w =
                this.contents.width;

            var h =
                this.contents.height;

            var alpha =
                TutorialHUD.backgroundOpacity /
                255;

            var background =
                'rgba(10,10,10,' +
                alpha +
                ')';

            this.contents.fillRect(
                0,
                0,
                w,
                h,
                background
            );

            var color =
                TutorialHUD.highlightColor;

            this.contents.fillRect(
                0,
                0,
                w,
                2,
                color
            );

            this.contents.fillRect(
                0,
                h - 2,
                w,
                2,
                color
            );

            this.contents.fillRect(
                0,
                0,
                2,
                h,
                color
            );

            this.contents.fillRect(
                w - 2,
                0,
                2,
                h,
                color
            );

        };


    // ========================================================================
    // CABEÇALHO HUD
    // ========================================================================

    Window_TutorialHUD.prototype.drawHeader =
        function(title) {

            this.contents.fontSize = 20;

            this.changeTextColor(
                TutorialHUD.highlightColor
            );

            this.drawText(
                title,
                12,
                6,
                this.contents.width - 24,
                'left'
            );

            this.resetTextColor();

            this.contents.fillRect(
                12,
                34,
                this.contents.width - 24,
                1,
                TutorialHUD.highlightColor
            );

        };


    // ========================================================================
    // TEXTO HUD
    // ========================================================================

    Window_TutorialHUD.prototype.drawInstruction =
        function(text) {

            this.contents.fontSize = 16;

            this.resetTextColor();

            this.drawText(
                text,
                12,
                40,
                this.contents.width - 24,
                'left'
            );

        };


    // ========================================================================
    // TECLA HUD
    // ========================================================================

    Window_TutorialHUD.prototype.drawKey =
        function(
            label,
            x,
            y,
            width,
            pressed
        ) {

            var height = 34;

            var background =
                pressed
                    ? TutorialHUD.highlightColor
                    : '#282828';

            var border =
                pressed
                    ? '#FFFFFF'
                    : '#777777';


            this.contents.fillRect(
                x,
                y,
                width,
                height,
                background
            );


            this.contents.fillRect(
                x,
                y,
                width,
                1,
                border
            );

            this.contents.fillRect(
                x,
                y + height - 1,
                width,
                1,
                border
            );

            this.contents.fillRect(
                x,
                y,
                1,
                height,
                border
            );

            this.contents.fillRect(
                x + width - 1,
                y,
                1,
                height,
                border
            );


            this.contents.fontSize = 17;

            this.changeTextColor('#FFFFFF');

            this.drawText(
                label,
                x,
                y + 2,
                width,
                'center'
            );

            this.resetTextColor();

        };


    // ========================================================================
    // SETAS HUD
    // ========================================================================

    Window_TutorialHUD.prototype.drawMovementKeys =
        function(
            baseX,
            baseY
        ) {

            var size = 42;
            var gap = 5;


            this.drawKey(
                '↑',
                baseX + size + gap,
                baseY,
                size,
                Input.isPressed('up')
            );


            this.drawKey(
                '←',
                baseX,
                baseY + 39,
                size,
                Input.isPressed('left')
            );


            this.drawKey(
                '↓',
                baseX + size + gap,
                baseY + 39,
                size,
                Input.isPressed('down')
            );


            this.drawKey(
                '→',
                baseX + (size + gap) * 2,
                baseY + 39,
                size,
                Input.isPressed('right')
            );

        };


    // ========================================================================
    // CONTROLES HUD
    // ========================================================================

    Window_TutorialHUD.prototype.drawControls =
        function(step) {

            var y = 75;


            switch (step) {


                case 'movement':

                    this.drawMovementKeys(
                        90,
                        y
                    );

                    break;


                case 'run':

                    this.drawKey(
                        'SHIFT',
                        25,
                        y + 20,
                        90,
                        Input.isPressed('shift')
                    );

                    this.drawMovementKeys(
                        155,
                        y
                    );

                    break;


                case 'interact':

                    this.drawKey(
                        'ENTER',
                        18,
                        y + 25,
                        82,
                        Input.isPressed('ok')
                    );

                    this.drawKey(
                        'ESPAÇO',
                        110,
                        y + 25,
                        95,
                        Input.isPressed('ok')
                    );

                    this.drawKey(
                        'Z',
                        215,
                        y + 25,
                        50,
                        Input.isPressed('ok')
                    );

                    break;


                case 'menu':

                    this.drawKey(
                        'ESC',
                        75,
                        y + 25,
                        82,
                        Input.isPressed('cancel')
                    );

                    this.drawKey(
                        'X',
                        170,
                        y + 25,
                        60,
                        Input.isPressed('cancel')
                    );

                    break;


                case 'quests':

                    this.contents.fontSize = 18;

                    this.drawText(
                        'MENU  →  MISSÕES',
                        25,
                        y + 30,
                        this.contents.width - 50,
                        'center'
                    );

                    break;


                case 'trackExample':
                case 'trackTutorial':

                    this.contents.fontSize = 18;

                    this.drawText(
                        'Selecione a missão e escolha Rastrear',
                        15,
                        y + 20,
                        this.contents.width - 30,
                        'center'
                    );

                    break;


                case 'finish':

                    this.contents.fontSize = 24;

                    this.changeTextColor(
                        TutorialHUD.highlightColor
                    );

                    this.drawText(
                        '✓',
                        0,
                        y + 20,
                        this.contents.width,
                        'center'
                    );

                    this.resetTextColor();

                    break;

            }

        };


    // ========================================================================
    // ADICIONAR HUD AO MAPA
    // ========================================================================

    var _TutorialHUD_SceneMap_createAllWindows =
        Scene_Map.prototype.createAllWindows;


    Scene_Map.prototype.createAllWindows =
        function() {

            _TutorialHUD_SceneMap_createAllWindows.call(this);

            this._tutorialHudWindow =
                new Window_TutorialHUD();

            this.addWindow(
                this._tutorialHudWindow
            );

        };


    // ========================================================================
    // QUEST RASTREADA
    // ========================================================================

    TutorialHUD._onQuestTracked =
        function(id) {

            TutorialHUD.ensureData();

            $gameSystem._tutorialLastTrackedQuest =
                id;


            if (!$gameSystem._tutorialHudActive) {
                return;
            }


            if (!TutorialHUD.questIntegration) {
                return;
            }


            var tutorialId =
                TutorialHUD.tutorialQuestId;

            var exampleId =
                TutorialHUD.exampleQuestId;

            var step =
                $gameSystem._tutorialHudStep;


            // =================================================================
            // QUEST EXEMPLO
            // =================================================================

            if (
                step === 'trackExample' &&
                id === exampleId
            ) {

                if (
                    typeof Galv !== 'undefined' &&
                    Galv.QUEST
                ) {

                    // ABRA AS MISSÕES

                    Galv.QUEST.objective(
                        tutorialId,
                        4,
                        'complete',
                        true
                    );


                    // RASTREIE OUTRA MISSÃO

                    Galv.QUEST.objective(
                        tutorialId,
                        5,
                        'complete',
                        true
                    );


                    // RASTREIE O TUTORIAL

                    Galv.QUEST.objective(
                        tutorialId,
                        6,
                        'activate',
                        true
                    );


                    // QUEST EXEMPLO

                    Galv.QUEST.objective(
                        exampleId,
                        0,
                        'complete',
                        true
                    );


                    // CONCLUSÃO SILENCIOSA

                    if (
                        typeof MissaoHUD !== 'undefined' &&
                        typeof MissaoHUD.silentComplete ===
                        'function'
                    ) {

                        MissaoHUD.silentComplete(
                            exampleId
                        );

                    }

                    else if (
                        typeof Galv.QUEST.complete ===
                        'function'
                    ) {

                        Galv.QUEST.complete(
                            exampleId,
                            true
                        );

                    }

                }


                TutorialHUD.step(
                    'trackTutorial'
                );

            }


                // =================================================================
                // VOLTA PARA QUEST DO TUTORIAL
            // =================================================================

            else if (
                step === 'trackTutorial' &&
                id === tutorialId
            ) {

                if (
                    typeof Galv !== 'undefined' &&
                    Galv.QUEST
                ) {

                    Galv.QUEST.objective(
                        tutorialId,
                        6,
                        'complete',
                        true
                    );


                    Galv.QUEST.objective(
                        tutorialId,
                        7,
                        'activate',
                        true
                    );

                }


                TutorialHUD.step(
                    'finish'
                );

            }


            TutorialHUD.refresh();

        };


    // ========================================================================
    // INTEGRAÇÃO GALV
    // ========================================================================

    if (
        TutorialHUD.questIntegration &&
        typeof Galv !== 'undefined' &&
        Galv.QUEST &&
        typeof Galv.QUEST.track === 'function'
    ) {

        var _TutorialHUD_GalvQuest_track =
            Galv.QUEST.track;


        Galv.QUEST.track =
            function(id) {

                var result =
                    _TutorialHUD_GalvQuest_track.apply(
                        this,
                        arguments
                    );


                TutorialHUD._onQuestTracked(
                    Number(id || 0)
                );


                return result;

            };

    }


    // ========================================================================
    // CONTROLES - VERIFICAR DESBLOQUEIO
    // ========================================================================

    TutorialHUD.controlsUnlocked = function() {

        var switchId =
            TutorialHUD.completeSwitch;

        if (switchId <= 0) {
            return false;
        }

        return $gameSwitches.value(
            switchId
        );

    };


    // ========================================================================
    // ADICIONAR "CONTROLES" AO MENU
    // ========================================================================

    var _TutorialHUD_WindowMenuCommand_addOriginalCommands =
        Window_MenuCommand.prototype.addOriginalCommands;


    Window_MenuCommand.prototype.addOriginalCommands =
        function() {

            _TutorialHUD_WindowMenuCommand_addOriginalCommands.call(
                this
            );


            if (
                TutorialHUD.controlsUnlocked()
            ) {

                this.addCommand(
                    TutorialHUD.controlsCommandName,
                    'tutorialControls',
                    true
                );

            }

        };


    // ========================================================================
    // HANDLER MENU
    // ========================================================================

    var _TutorialHUD_SceneMenu_createCommandWindow =
        Scene_Menu.prototype.createCommandWindow;


    Scene_Menu.prototype.createCommandWindow =
        function() {

            _TutorialHUD_SceneMenu_createCommandWindow.call(
                this
            );


            this._commandWindow.setHandler(
                'tutorialControls',
                this.commandTutorialControls.bind(this)
            );

        };


    Scene_Menu.prototype.commandTutorialControls =
        function() {

            SceneManager.push(
                Scene_TutorialControls
            );

        };


    // ========================================================================
    // ABRIR CONTROLES VIA SCRIPT
    // ========================================================================

    TutorialHUD.openControls = function() {

        SceneManager.push(
            Scene_TutorialControls
        );

    };


    // ========================================================================
    // SCENE CONTROLES
    // ========================================================================

    function Scene_TutorialControls() {

        this.initialize.apply(
            this,
            arguments
        );

    }


    Scene_TutorialControls.prototype =
        Object.create(
            Scene_MenuBase.prototype
        );


    Scene_TutorialControls.prototype.constructor =
        Scene_TutorialControls;


    Scene_TutorialControls.prototype.initialize =
        function() {

            Scene_MenuBase.prototype.initialize.call(
                this
            );

        };


    Scene_TutorialControls.prototype.create =
        function() {

            Scene_MenuBase.prototype.create.call(
                this
            );

            this.createControlsWindow();

        };


    Scene_TutorialControls.prototype.createControlsWindow =
        function() {

            this._controlsWindow =
                new Window_TutorialControls();

            this.addWindow(
                this._controlsWindow
            );

        };


    // ========================================================================
    // WINDOW CONTROLES
    // ========================================================================

    function Window_TutorialControls() {

        this.initialize.apply(
            this,
            arguments
        );

    }


    Window_TutorialControls.prototype =
        Object.create(
            Window_Base.prototype
        );


    Window_TutorialControls.prototype.constructor =
        Window_TutorialControls;


    Window_TutorialControls.prototype.initialize =
        function() {

            var margin = 24;

            Window_Base.prototype.initialize.call(
                this,
                margin,
                margin,
                Graphics.boxWidth - (margin * 2),
                Graphics.boxHeight - (margin * 2)
            );

            this.refresh();

        };


    // ========================================================================
    // UPDATE CONTROLES
    // ========================================================================

    Window_TutorialControls.prototype.update =
        function() {

            Window_Base.prototype.update.call(
                this
            );


            if (
                Input.isTriggered('cancel')
            ) {

                SoundManager.playCancel();

                SceneManager.pop();

            }

        };


    // ========================================================================
    // KEY BOX CONTROLES
    // ========================================================================

    Window_TutorialControls.prototype.drawKeyBox =
        function(
            label,
            x,
            y,
            width
        ) {

            var height = 38;

            var background =
                '#282828';

            var border =
                TutorialHUD.highlightColor;


            this.contents.fillRect(
                x,
                y,
                width,
                height,
                background
            );


            this.contents.fillRect(
                x,
                y,
                width,
                2,
                border
            );

            this.contents.fillRect(
                x,
                y + height - 2,
                width,
                2,
                border
            );

            this.contents.fillRect(
                x,
                y,
                2,
                height,
                border
            );

            this.contents.fillRect(
                x + width - 2,
                y,
                2,
                height,
                border
            );


            this.contents.fontSize = 18;

            this.changeTextColor(
                '#FFFFFF'
            );


            this.drawText(
                label,
                x,
                y + 3,
                width,
                'center'
            );


            this.resetTextColor();

        };


    // ========================================================================
    // TÍTULO DE SEÇÃO
    // ========================================================================

    Window_TutorialControls.prototype.drawControlTitle =
        function(
            text,
            x,
            y,
            width
        ) {

            this.contents.fontSize = 20;

            this.changeTextColor(
                TutorialHUD.highlightColor
            );

            this.drawText(
                text,
                x,
                y,
                width,
                'left'
            );

            this.resetTextColor();

        };


    // ========================================================================
    // REFRESH CONTROLES
    // ========================================================================

    Window_TutorialControls.prototype.refresh =
        function() {

            this.contents.clear();


            var width =
                this.contents.width;

            var height =
                this.contents.height;


            // ----------------------------------------------------------------
            // TÍTULO
            // ----------------------------------------------------------------

            this.contents.fontSize = 30;

            this.changeTextColor(
                TutorialHUD.highlightColor
            );


            this.drawText(
                'CONTROLES',
                0,
                10,
                width,
                'center'
            );


            this.resetTextColor();


            this.contents.fillRect(
                20,
                55,
                width - 40,
                1,
                TutorialHUD.highlightColor
            );


            // ----------------------------------------------------------------
            // MOVIMENTAÇÃO
            // ----------------------------------------------------------------

            this.drawControlTitle(
                'Movimentação',
                45,
                80,
                250
            );


            this.drawKeyBox(
                '↑',
                125,
                120,
                45
            );


            this.drawKeyBox(
                '←',
                75,
                163,
                45
            );


            this.drawKeyBox(
                '↓',
                125,
                163,
                45
            );


            this.drawKeyBox(
                '→',
                175,
                163,
                45
            );


            // ----------------------------------------------------------------
            // CORRER
            // ----------------------------------------------------------------

            this.drawControlTitle(
                'Correr',
                45,
                225,
                250
            );


            this.drawKeyBox(
                'SHIFT',
                75,
                265,
                100
            );


            this.contents.fontSize = 18;

            this.drawText(
                '+ direção',
                185,
                269,
                130,
                'left'
            );


            // ----------------------------------------------------------------
            // INTERAGIR
            // ----------------------------------------------------------------

            var rightX =
                Math.floor(width / 2) + 25;


            this.drawControlTitle(
                'Interagir / Confirmar',
                rightX,
                80,
                300
            );


            this.drawKeyBox(
                'ENTER',
                rightX,
                120,
                90
            );


            this.drawKeyBox(
                'ESPAÇO',
                rightX + 100,
                120,
                100
            );


            this.drawKeyBox(
                'Z',
                rightX + 210,
                120,
                50
            );


            // ----------------------------------------------------------------
            // MENU
            // ----------------------------------------------------------------

            this.drawControlTitle(
                'Menu / Voltar',
                rightX,
                190,
                300
            );


            this.drawKeyBox(
                'ESC',
                rightX,
                230,
                80
            );


            this.drawKeyBox(
                'X',
                rightX + 90,
                230,
                55
            );


            // ----------------------------------------------------------------
            // MISSÕES
            // ----------------------------------------------------------------

            this.drawControlTitle(
                'Missões',
                rightX,
                300,
                250
            );


            this.contents.fontSize = 18;

            this.drawText(
                'Menu  →  Missões',
                rightX,
                340,
                260,
                'left'
            );


            // ----------------------------------------------------------------
            // RODAPÉ
            // ----------------------------------------------------------------

            this.contents.fontSize = 16;

            this.changeTextColor(
                '#BBBBBB'
            );


            this.drawText(
                'Pressione ESC ou X para voltar',
                0,
                height - 48,
                width,
                'center'
            );


            this.resetTextColor();

        };


    // ========================================================================
    // PLUGIN COMMANDS
    // ========================================================================

    var _TutorialHUD_GameInterpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;


    Game_Interpreter.prototype.pluginCommand =
        function(
            command,
            args
        ) {

            _TutorialHUD_GameInterpreter_pluginCommand.call(
                this,
                command,
                args
            );


            if (
                String(command).toUpperCase() !==
                'TUTORIALHUD'
            ) {

                return;

            }


            var action =
                String(
                    args[0] || ''
                ).toUpperCase();


            switch (action) {


                case 'START':

                    TutorialHUD.start();

                    break;


                case 'PREPARE':

                    TutorialHUD.prepare();

                    break;


                case 'SHOW':

                    TutorialHUD.show();

                    break;


                case 'HIDE':

                    TutorialHUD.hide();

                    break;


                case 'END':

                    TutorialHUD.end();

                    break;


                case 'STEP':

                    TutorialHUD.step(
                        args[1] ||
                        'movement'
                    );

                    break;


                case 'CONTROLS':

                    TutorialHUD.openControls();

                    break;

            }

        };


})();