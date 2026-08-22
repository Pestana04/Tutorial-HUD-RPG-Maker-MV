/*:
 * @plugindesc v0.1.0 - HUD interativa para o tutorial do projeto Missão UAI.
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
 * @help
 * ============================================================================
 * TutorialHUD
 * ============================================================================
 *
 * HUD interativa criada para o tutorial do projeto Missão UAI.
 *
 * Coloque este plugin ABAIXO de:
 *
 * Galv_QuestLog
 * MissaoHUD
 * TutorialHUD
 *
 * ============================================================================
 * SCRIPT CALLS
 * ============================================================================
 *
 * TutorialHUD.prepare();
 *    Prepara e inicia o tutorial.
 *
 * TutorialHUD.show();
 *    Exibe a HUD.
 *
 * TutorialHUD.hide();
 *    Oculta a HUD.
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
 * TutorialHUD.setText('TÍTULO', 'Mensagem');
 *    Permite mostrar um texto personalizado.
 *
 * TutorialHUD.lastTrackedQuest();
 *    Retorna o ID da última missão rastreada.
 *
 * TutorialHUD.end();
 *    Encerra e oculta a HUD.
 *
 * ============================================================================
 */

var Imported = Imported || {};
Imported.TutorialHUD = true;

var TutorialHUD = TutorialHUD || {};

(function() {

    "use strict";

    // -------------------------------------------------------------------------
    // PARÂMETROS
    // -------------------------------------------------------------------------

    var params = PluginManager.parameters('TutorialHUD');

    TutorialHUD.width = Number(params['Largura'] || 360);
    TutorialHUD.height = Number(params['Altura'] || 190);
    TutorialHUD.margin = Number(params['Margem'] || 12);
    TutorialHUD.backgroundOpacity = Number(params['OpacidadeFundo'] || 190);

    TutorialHUD.highlightColor =
        String(params['CorDestaque'] || '#D99A4E');

    TutorialHUD.tutorialQuestId =
        Number(params['TutorialQuestId'] || 5);

    TutorialHUD.exampleQuestId =
        Number(params['QuestExemploId'] || 6);

    TutorialHUD.questIntegration =
        String(params['IntegracaoQuestLog'] || 'true') === 'true';


    // -------------------------------------------------------------------------
    // GAME SYSTEM
    // -------------------------------------------------------------------------

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


    // -------------------------------------------------------------------------
    // GARANTIR DADOS EM SAVES ANTIGOS
    // -------------------------------------------------------------------------

    TutorialHUD.ensureData = function() {

        if (!$gameSystem) return;

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


    // -------------------------------------------------------------------------
    // API PÚBLICA
    // -------------------------------------------------------------------------

    TutorialHUD.start = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudActive = true;
        $gameSystem._tutorialHudVisible = true;
        $gameSystem._tutorialHudStep = 'movement';

        $gameSystem._tutorialHudCustomTitle = '';
        $gameSystem._tutorialHudCustomText = '';

        TutorialHUD.refresh();
    };


    TutorialHUD.prepare = function() {

        TutorialHUD.start();

        if (!window.Galv ||
            !Galv.QUEST ||
            typeof Galv.QUEST.activate !== 'function') {
            return;
        }

        var tutorialId = TutorialHUD.tutorialQuestId;
        var exampleId = TutorialHUD.exampleQuestId;

        // Ativa apenas as duas quests utilizadas no tutorial.
        Galv.QUEST.activate(tutorialId);
        Galv.QUEST.activate(exampleId);

        // Quest 5 - Tutorial.
        Galv.QUEST.objective(tutorialId, 0, 'activate');

        for (var i = 1; i <= 7; i++) {
            Galv.QUEST.objective(tutorialId, i, 'hide');
        }

        // Quest 6 - Exemplo.
        Galv.QUEST.objective(exampleId, 0, 'activate');

        // Tutorial começa sendo a missão rastreada.
        Galv.QUEST.track(tutorialId);
    };


    TutorialHUD.show = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudVisible = true;

        TutorialHUD.refresh();
    };


    TutorialHUD.hide = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudVisible = false;

        TutorialHUD.refresh();
    };


    TutorialHUD.end = function() {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudActive = false;
        $gameSystem._tutorialHudVisible = false;

        TutorialHUD.refresh();
    };


    TutorialHUD.step = function(step) {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudStep = String(step);

        $gameSystem._tutorialHudCustomTitle = '';
        $gameSystem._tutorialHudCustomText = '';

        TutorialHUD.refresh();
    };


    TutorialHUD.setText = function(title, text) {

        TutorialHUD.ensureData();

        $gameSystem._tutorialHudCustomTitle = String(title || '');
        $gameSystem._tutorialHudCustomText = String(text || '');

        TutorialHUD.refresh();
    };


    TutorialHUD.lastTrackedQuest = function() {

        TutorialHUD.ensureData();

        return Number($gameSystem._tutorialLastTrackedQuest || 0);
    };


    TutorialHUD.refresh = function() {

        if (SceneManager._scene &&
            SceneManager._scene._tutorialHudWindow) {

            SceneManager._scene._tutorialHudWindow.refresh();
        }
    };


    // -------------------------------------------------------------------------
    // TEXTOS DAS ETAPAS
    // -------------------------------------------------------------------------

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


    // -------------------------------------------------------------------------
    // JANELA DO TUTORIAL
    // -------------------------------------------------------------------------

    function Window_TutorialHUD() {
        this.initialize.apply(this, arguments);
    }

    Window_TutorialHUD.prototype =
        Object.create(Window_Base.prototype);

    Window_TutorialHUD.prototype.constructor =
        Window_TutorialHUD;


    Window_TutorialHUD.prototype.initialize = function() {

        var x = TutorialHUD.margin;
        var y = TutorialHUD.margin;

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


    Window_TutorialHUD.prototype.update = function() {

        Window_Base.prototype.update.call(this);

        TutorialHUD.ensureData();

        this.visible =
            $gameSystem._tutorialHudActive &&
            $gameSystem._tutorialHudVisible;

        if (!this.visible) return;

        var signature = this.inputSignature();

        if (signature !== this._lastInputSignature) {

            this._lastInputSignature = signature;
            this.refresh();
        }
    };


    Window_TutorialHUD.prototype.inputSignature = function() {

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


    Window_TutorialHUD.prototype.refresh = function() {

        if (!this.contents) return;

        this.contents.clear();

        TutorialHUD.ensureData();

        this.visible =
            $gameSystem._tutorialHudActive &&
            $gameSystem._tutorialHudVisible;

        if (!this.visible) return;

        this.drawBackground();

        var step = $gameSystem._tutorialHudStep;

        var data = TutorialHUD.stepData(step);

        var title =
            $gameSystem._tutorialHudCustomTitle || data.title;

        var text =
            $gameSystem._tutorialHudCustomText || data.text;

        this.drawHeader(title);
        this.drawInstruction(text);
        this.drawControls(step);
    };


    Window_TutorialHUD.prototype.drawBackground = function() {

        var w = this.contents.width;
        var h = this.contents.height;

        var alpha =
            TutorialHUD.backgroundOpacity / 255;

        var background =
            'rgba(10,10,10,' + alpha + ')';

        this.contents.fillRect(
            0,
            0,
            w,
            h,
            background
        );

        var c = TutorialHUD.highlightColor;

        this.contents.fillRect(0, 0, w, 2, c);
        this.contents.fillRect(0, h - 2, w, 2, c);
        this.contents.fillRect(0, 0, 2, h, c);
        this.contents.fillRect(w - 2, 0, 2, h, c);
    };


    Window_TutorialHUD.prototype.drawHeader = function(title) {

        this.contents.fontSize = 20;
        this.changeTextColor(TutorialHUD.highlightColor);

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


    Window_TutorialHUD.prototype.drawInstruction = function(text) {

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


    // -------------------------------------------------------------------------
    // DESENHO DOS BOTÕES
    // -------------------------------------------------------------------------

    Window_TutorialHUD.prototype.drawKey =
        function(label, x, y, width, pressed) {

            var h = 34;

            var background = pressed
                ? TutorialHUD.highlightColor
                : '#282828';

            var border = pressed
                ? '#FFFFFF'
                : '#777777';

            this.contents.fillRect(
                x,
                y,
                width,
                h,
                background
            );

            this.contents.fillRect(x, y, width, 1, border);
            this.contents.fillRect(x, y + h - 1, width, 1, border);
            this.contents.fillRect(x, y, 1, h, border);
            this.contents.fillRect(x + width - 1, y, 1, h, border);

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


    Window_TutorialHUD.prototype.drawMovementKeys =
        function(baseX, baseY) {

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


    Window_TutorialHUD.prototype.drawControls = function(step) {

        var y = 75;

        switch (step) {

            case 'movement':

                this.drawMovementKeys(90, y);
                break;


            case 'run':

                this.drawKey(
                    'SHIFT',
                    25,
                    y + 20,
                    90,
                    Input.isPressed('shift')
                );

                this.drawMovementKeys(155, y);
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
                this.changeTextColor(TutorialHUD.highlightColor);

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


    // -------------------------------------------------------------------------
    // ADICIONAR HUD AO MAPA
    // -------------------------------------------------------------------------

    var _TutorialHUD_SceneMap_createAllWindows =
        Scene_Map.prototype.createAllWindows;

    Scene_Map.prototype.createAllWindows = function() {

        _TutorialHUD_SceneMap_createAllWindows.call(this);

        this._tutorialHudWindow =
            new Window_TutorialHUD();

        this.addWindow(this._tutorialHudWindow);
    };


    // -------------------------------------------------------------------------
    // INTEGRAÇÃO COM GALV QUEST LOG
    // -------------------------------------------------------------------------

    TutorialHUD._onQuestTracked = function(id) {

        TutorialHUD.ensureData();

        $gameSystem._tutorialLastTrackedQuest = id;

        if (!$gameSystem._tutorialHudActive) return;
        if (!TutorialHUD.questIntegration) return;

        var tutorialId = TutorialHUD.tutorialQuestId;
        var exampleId = TutorialHUD.exampleQuestId;

        var step = $gameSystem._tutorialHudStep;


        // ---------------------------------------------------------------------
        // JOGADOR RASTREOU A QUEST EXEMPLO
        // ---------------------------------------------------------------------

        if (step === 'trackExample' && id === exampleId) {

            if (window.Galv && Galv.QUEST) {

                // Objetivo: Rastreie outra missão
                Galv.QUEST.objective(
                    tutorialId,
                    5,
                    'complete'
                );

                // Próximo objetivo:
                // Rastreie o tutorial
                Galv.QUEST.objective(
                    tutorialId,
                    6,
                    'activate'
                );

                // Quest exemplo cumpriu sua função.
                Galv.QUEST.objective(
                    exampleId,
                    0,
                    'complete'
                );

                if (typeof Galv.QUEST.complete === 'function') {
                    Galv.QUEST.complete(exampleId);
                }
            }

            TutorialHUD.step('trackTutorial');
        }


            // ---------------------------------------------------------------------
            // JOGADOR VOLTOU A RASTREAR O TUTORIAL
        // ---------------------------------------------------------------------

        else if (step === 'trackTutorial' && id === tutorialId) {

            if (window.Galv && Galv.QUEST) {

                Galv.QUEST.objective(
                    tutorialId,
                    6,
                    'complete'
                );

                Galv.QUEST.objective(
                    tutorialId,
                    7,
                    'activate'
                );
            }

            TutorialHUD.step('finish');
        }

        TutorialHUD.refresh();
    };


    if (TutorialHUD.questIntegration &&
        window.Galv &&
        Galv.QUEST &&
        typeof Galv.QUEST.track === 'function') {

        var _TutorialHUD_GalvQuest_track =
            Galv.QUEST.track;

        Galv.QUEST.track = function(id) {

            var result =
                _TutorialHUD_GalvQuest_track.apply(
                    this,
                    arguments
                );

            TutorialHUD._onQuestTracked(
                Number(id)
            );

            return result;
        };
    }


    // -------------------------------------------------------------------------
    // PLUGIN COMMANDS
    // -------------------------------------------------------------------------

    var _TutorialHUD_GameInterpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {

            _TutorialHUD_GameInterpreter_pluginCommand.call(
                this,
                command,
                args
            );

            if (String(command).toUpperCase() !== 'TUTORIALHUD') {
                return;
            }

            var action =
                String(args[0] || '').toUpperCase();

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
                    TutorialHUD.step(args[1] || 'movement');
                    break;
            }
        };

})();