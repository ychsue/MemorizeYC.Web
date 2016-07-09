var SpeechSynthesisHelper = (function () {
    function SpeechSynthesisHelper() {
    }
    SpeechSynthesisHelper.getAllVoices = function (callback) {
        if (!GlobalVariables.synthesis)
            return;
        SpeechSynthesisHelper.callbacks.push(callback);
        if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
            setTimeout(function () {
                while (SpeechSynthesisHelper.callbacks.length > 0) {
                    SpeechSynthesisHelper.callbacks.shift()();
                }
            }, 1);
            return;
        }
        SpeechSynthesisHelper.ith = 0;
        if (!GlobalVariables.allVoices || GlobalVariables.allVoices.length === 0)
            GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
        if (!SpeechSynthesisHelper.timerID) {
            SpeechSynthesisHelper.timerID = setInterval(function () {
                SpeechSynthesisHelper.ith++;
                if ((GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) || SpeechSynthesisHelper.ith > 20) {
                    clearInterval(SpeechSynthesisHelper.timerID);
                    if (GlobalVariables.allVoices) {
                        GlobalVariables.synUtterance = new SpeechSynthesisUtterance("Welcome!");
                        while (SpeechSynthesisHelper.callbacks.length > 0) {
                            SpeechSynthesisHelper.callbacks.shift()();
                        }
                    }
                    SpeechSynthesisHelper.timerID = null;
                    SpeechSynthesisHelper.ith = 0;
                }
                else {
                    GlobalVariables.allVoices = GlobalVariables.synthesis.getVoices();
                }
            }, 250);
        }
        ;
    };
    SpeechSynthesisHelper.getSynVoiceFromLang = function (lang) {
        if (!GlobalVariables.allVoices)
            return null;
        var vVoice = null;
        for (var i0 = 0; i0 < GlobalVariables.allVoices.length; i0++) {
            var voice = GlobalVariables.allVoices[i0];
            if (lang != "" && voice.lang != "" && (lang.toLowerCase().replace(/_/g, '-')).indexOf(voice.lang.toLowerCase().replace(/_/g, '-')) >= 0) {
                vVoice = voice;
                break;
            }
        }
        ;
        return vVoice;
    };
    SpeechSynthesisHelper.Speak = function (text, lang, voice, rate) {
        if (rate === void 0) { rate = 1; }
        if (!GlobalVariables.synthesis)
            return;
        if (!GlobalVariables.synUtterance)
            GlobalVariables.synUtterance = new SpeechSynthesisUtterance("Hello! New start.");
        GlobalVariables.synUtterance.text = text;
        GlobalVariables.synUtterance.lang = lang;
        GlobalVariables.synUtterance.voice = voice;
        GlobalVariables.synUtterance.rate = rate;
        GlobalVariables.synthesis.cancel();
        GlobalVariables.synthesis.speak(GlobalVariables.synUtterance);
    };
    SpeechSynthesisHelper.ith = 0;
    SpeechSynthesisHelper.callbacks = [];
    SpeechSynthesisHelper._iOS9Voices = [
        { name: "Maged", voiceURI: "com.apple.ttsbundle.Maged-compact", lang: "ar-SA", localService: true, "default": true },
        { name: "Zuzana", voiceURI: "com.apple.ttsbundle.Zuzana-compact", lang: "cs-CZ", localService: true, "default": true },
        { name: "Sara", voiceURI: "com.apple.ttsbundle.Sara-compact", lang: "da-DK", localService: true, "default": true },
        { name: "Anna", voiceURI: "com.apple.ttsbundle.Anna-compact", lang: "de-DE", localService: true, "default": true },
        { name: "Melina", voiceURI: "com.apple.ttsbundle.Melina-compact", lang: "el-GR", localService: true, "default": true },
        { name: "Karen", voiceURI: "com.apple.ttsbundle.Karen-compact", lang: "en-AU", localService: true, "default": true },
        { name: "Daniel", voiceURI: "com.apple.ttsbundle.Daniel-compact", lang: "en-GB", localService: true, "default": true },
        { name: "Moira", voiceURI: "com.apple.ttsbundle.Moira-compact", lang: "en-IE", localService: true, "default": true },
        { name: "Samantha (Enhanced)", voiceURI: "com.apple.ttsbundle.Samantha-premium", lang: "en-US", localService: true, "default": true },
        { name: "Samantha", voiceURI: "com.apple.ttsbundle.Samantha-compact", lang: "en-US", localService: true, "default": true },
        { name: "Tessa", voiceURI: "com.apple.ttsbundle.Tessa-compact", lang: "en-ZA", localService: true, "default": true },
        { name: "Monica", voiceURI: "com.apple.ttsbundle.Monica-compact", lang: "es-ES", localService: true, "default": true },
        { name: "Paulina", voiceURI: "com.apple.ttsbundle.Paulina-compact", lang: "es-MX", localService: true, "default": true },
        { name: "Satu", voiceURI: "com.apple.ttsbundle.Satu-compact", lang: "fi-FI", localService: true, "default": true },
        { name: "Amelie", voiceURI: "com.apple.ttsbundle.Amelie-compact", lang: "fr-CA", localService: true, "default": true },
        { name: "Thomas", voiceURI: "com.apple.ttsbundle.Thomas-compact", lang: "fr-FR", localService: true, "default": true },
        { name: "Carmit", voiceURI: "com.apple.ttsbundle.Carmit-compact", lang: "he-IL", localService: true, "default": true },
        { name: "Lekha", voiceURI: "com.apple.ttsbundle.Lekha-compact", lang: "hi-IN", localService: true, "default": true },
        { name: "Mariska", voiceURI: "com.apple.ttsbundle.Mariska-compact", lang: "hu-HU", localService: true, "default": true },
        { name: "Damayanti", voiceURI: "com.apple.ttsbundle.Damayanti-compact", lang: "id-ID", localService: true, "default": true },
        { name: "Alice", voiceURI: "com.apple.ttsbundle.Alice-compact", lang: "it-IT", localService: true, "default": true },
        { name: "Kyoko", voiceURI: "com.apple.ttsbundle.Kyoko-compact", lang: "ja-JP", localService: true, "default": true },
        { name: "Yuna", voiceURI: "com.apple.ttsbundle.Yuna-compact", lang: "ko-KR", localService: true, "default": true },
        { name: "Ellen", voiceURI: "com.apple.ttsbundle.Ellen-compact", lang: "nl-BE", localService: true, "default": true },
        { name: "Xander", voiceURI: "com.apple.ttsbundle.Xander-compact", lang: "nl-NL", localService: true, "default": true },
        { name: "Nora", voiceURI: "com.apple.ttsbundle.Nora-compact", lang: "no-NO", localService: true, "default": true },
        { name: "Zosia", voiceURI: "com.apple.ttsbundle.Zosia-compact", lang: "pl-PL", localService: true, "default": true },
        { name: "Luciana", voiceURI: "com.apple.ttsbundle.Luciana-compact", lang: "pt-BR", localService: true, "default": true },
        { name: "Joana", voiceURI: "com.apple.ttsbundle.Joana-compact", lang: "pt-PT", localService: true, "default": true },
        { name: "Ioana", voiceURI: "com.apple.ttsbundle.Ioana-compact", lang: "ro-RO", localService: true, "default": true },
        { name: "Milena", voiceURI: "com.apple.ttsbundle.Milena-compact", lang: "ru-RU", localService: true, "default": true },
        { name: "Laura", voiceURI: "com.apple.ttsbundle.Laura-compact", lang: "sk-SK", localService: true, "default": true },
        { name: "Alva", voiceURI: "com.apple.ttsbundle.Alva-compact", lang: "sv-SE", localService: true, "default": true },
        { name: "Kanya", voiceURI: "com.apple.ttsbundle.Kanya-compact", lang: "th-TH", localService: true, "default": true },
        { name: "Yelda", voiceURI: "com.apple.ttsbundle.Yelda-compact", lang: "tr-TR", localService: true, "default": true },
        { name: "Ting-Ting", voiceURI: "com.apple.ttsbundle.Ting-Ting-compact", lang: "zh-CN", localService: true, "default": true },
        { name: "Sin-Ji", voiceURI: "com.apple.ttsbundle.Sin-Ji-compact", lang: "zh-HK", localService: true, "default": true },
        { name: "Mei-Jia", voiceURI: "com.apple.ttsbundle.Mei-Jia-compact", lang: "zh-TW", localService: true, "default": true }
    ];
    return SpeechSynthesisHelper;
}());
var PlayTypeEnum = (function () {
    function PlayTypeEnum() {
    }
    PlayTypeEnum.syn = "syn";
    PlayTypeEnum.rec = "rec";
    PlayTypeEnum.hint = "hint";
    return PlayTypeEnum;
}());
;
var TutorMainEnum;
(function (TutorMainEnum) {
    TutorMainEnum[TutorMainEnum["Begin"] = 0] = "Begin";
    TutorMainEnum[TutorMainEnum["Basic"] = 1] = "Basic";
    TutorMainEnum[TutorMainEnum["Hint"] = 2] = "Hint";
    TutorMainEnum[TutorMainEnum["KeyIn"] = 3] = "KeyIn";
    TutorMainEnum[TutorMainEnum["End"] = 4] = "End";
})(TutorMainEnum || (TutorMainEnum = {}));
;
var TutorialHelper = (function () {
    function TutorialHelper() {
    }
    TutorialHelper.onBtHide = function (ev) {
        $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
    };
    TutorialHelper.onBtStop = function (ev) {
        $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
        GlobalVariables.isTutorMode = false;
    };
    TutorialHelper.Action = function (state) {
        $(GlobalVariables.gdTutorElements.btHide).off('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btHide).on('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btStop).off('click', TutorialHelper.onBtStop);
        $(GlobalVariables.gdTutorElements.btStop).on('click', TutorialHelper.onBtStop);
        switch (state.Main) {
            case TutorMainEnum.Begin:
                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:6vw;'>Tutorial</div>" +
                    "<div style='text-align:center; font-size:3vh;'>You are in tutorial mode.<br/>" +
                    "Choose the <b>Basic</b> in <span class='glyphicon glyphicon-menu-hamburger'></span> to start this tutorial.<br/>" +
                    "Or click <span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub> to stop it. </div>");
                $(".glyphicon-menu-hamburger").addClass('blink');
                $(".glyphicon-remove-sign").addClass('blink');
                $(PlayOneCategoryPageController.Current.rdTutorType).addClass('blink');
                var onStateChange = function (ev) {
                    $(PlayOneCategoryPageController.Current.rdTutorType).off(GlobalVariables.TutorTypeChangeKey, onStateChange);
                    $(".glyphicon-menu-hamburger").removeClass('blink');
                    $(".glyphicon-remove-sign").removeClass('blink');
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeClass('blink');
                    $('#dpPlaySettings').removeClass('open');
                    alert("Ok! Let's Start!");
                    $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                };
                $(PlayOneCategoryPageController.Current.rdTutorType).off(GlobalVariables.TutorTypeChangeKey, onStateChange);
                $(PlayOneCategoryPageController.Current.rdTutorType).on(GlobalVariables.TutorTypeChangeKey, onStateChange);
                break;
            case TutorMainEnum.Basic:
                switch (state.Step) {
                    case 0:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>1.1 Basic - Enlarge Cards</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-plus' style='color:red; font-size:4vw;'></span> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to enlarge all cards.</div>");
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $(".glyphicon-plus").addClass('blink');
                        $("#ddSettings .glyphicon-plus").one('click', function (ev) {
                            setTimeout(function () {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                $(".glyphicon-menu-hamburger").removeClass('blink');
                                $(".glyphicon-plus").removeClass('blink');
                                alert("Hooray!\nYou did it!");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        break;
                    case 1:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>1.2 Basic - Shrink Cards</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-minus' style='color:red; font-size:4vw;'></span> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to shrink all cards.</div>");
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $(".glyphicon-minus").addClass('blink');
                        $("#ddSettings .glyphicon-minus").one('click', function (ev) {
                            setTimeout(function () {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                $(".glyphicon-menu-hamburger").removeClass('blink');
                                $(".glyphicon-minus").removeClass('blink');
                                alert("Great Job!");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        break;
                    case 2:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>1.3 Basic - Pair</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-play' style='color:red;'></span><sub>Play</sub> or <span class='glyphicon glyphicon-step-forward' style='color:red;'></span><sub>Next</sub> at first.</div>");
                        $(".glyphicon-play").addClass('blink');
                        $(".glyphicon-step-forward").addClass('blink');
                        var onPlay = function (ev) {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>1.3.1 Pair - Tap Correct Card</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub> to hide this tutorial and tap a coorect card to annihilate it. </div>");
                            $("#gdTutorial #btHide").addClass('blink');
                            $("#btSynPlay,#btSynNext").off('click', onPlay);
                            $(".glyphicon-play").removeClass('blink');
                            $(".glyphicon-step-forward").removeClass('blink');
                            var onRemove = function (ev) {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                alert("Good Job!");
                                $("#btSynPlay").off(GlobalVariables.RemoveAWCardKey, onRemove);
                                $("#gdTutorial #btHide").removeClass('blink');
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $("#btSynPlay").off(GlobalVariables.RemoveAWCardKey, onRemove);
                            $("#btSynPlay").on(GlobalVariables.RemoveAWCardKey, onRemove);
                        };
                        $("#btSynPlay,#btSynNext").off('click', onPlay);
                        $("#btSynPlay,#btSynNext").on('click', onPlay);
                        break;
                    case 3:
                        if (!GlobalVariables.allVoices || GlobalVariables.allVoices.length === 0) {
                            GlobalVariables.tutorState.Step++;
                            TutorialHelper.Action(GlobalVariables.tutorState);
                            break;
                        }
                        ;
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>1.4 Basic - Change Speech Synthesizer's Voice</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Choose a Language beside the <span class='glyphicon glyphicon-refresh'></span> button in <img src='http://memorizeyc.azurewebsites.net/Static/PlayPage/SpeechLang.png' alt='Choose a Language' style='width:32px'/>.</div>");
                        $("#dropdownLangSettings").addClass('blink');
                        $("#cbSynAllVoices").addClass('blink');
                        var onChange = function (ev) {
                            $(PlayOneCategoryPageController.Current.btLangSettings).off(GlobalVariables.SynVoiceChangeKey, onChange);
                            $("#dropdownLangSettings").removeClass('blink');
                            $("#cbSynAllVoices").removeClass('blink');
                            $("#dpLangMain").removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>1.4.1 Basic - Voice is Changed</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-play'></span> will play the sentence with different voice.</div>");
                            $('.glyphicon-play').addClass('blink');
                            var onPlay = function (ev) {
                                $('.glyphicon-play').off('click', onPlay);
                                $('.glyphicon-play').removeClass('blink');
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                alert("Now you know how to change voices.");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $('.glyphicon-play').off('click', onPlay);
                            $('.glyphicon-play').on('click', onPlay);
                        };
                        $(PlayOneCategoryPageController.Current.btLangSettings).off(GlobalVariables.SynVoiceChangeKey, onChange);
                        $(PlayOneCategoryPageController.Current.btLangSettings).on(GlobalVariables.SynVoiceChangeKey, onChange);
                        break;
                    case 4:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:4vh;'>1.5 Basic - Change Cards</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            "  Because total number of cards might be larger than '" + PlayOneCategoryPageController.Current.numWCardShown + "'," +
                            "Click <button>Rest:<br /><span class='badge'>" + PlayOneCategoryPageController.Current.numRestWCards + "</span></button> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:3vh;'></span> to change cards.<br/>" +
                            "By the way, the number '" + PlayOneCategoryPageController.Current.numWCardShown + "' can be set by yourself." +
                            "</div>");
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $("#btChangeCards").addClass('blink');
                        $("#btChangeCards").one('click', function (ev) {
                            setTimeout(function () {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                $(".glyphicon-menu-hamburger").removeClass('blink');
                                $("#btChangeCards").removeClass('blink');
                                alert("Now you know how to change cards!");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        break;
                    case 5:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:4vh;'>1.6 Basic - Extra info for each Card</div>" +
                            "<div style='text-align:left; font-size:2vh;'> Hide me at first by clicking <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub>.<br/>" +
                            "Then, Double click (<img src='http://files.channel9.msdn.com/thumbnail/5b5394ca-30b2-4880-99fb-89de81c8e46b.jpg' style='width:3vh'/>X2) any Card will show you a popup for extra info.<br/>" +
                            " </div>");
                        $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                        var onShownInfo = function (ev) {
                            alert('Then you should see a popup. If not, it means that it has no extra info.');
                            $('.cvMain .WCard').off(GlobalVariables.onDoubleClick, onShownInfo);
                            $(GlobalVariables.gdTutorElements.btHide).removeClass('blink');
                            if (GlobalVariables.isTutorMode) {
                                GlobalVariables.tutorState.Step++;
                                TutorialHelper.Action(GlobalVariables.tutorState);
                            }
                        };
                        $('.cvMain .WCard').off(GlobalVariables.onDoubleClick, onShownInfo);
                        $('.cvMain .WCard').on(GlobalVariables.onDoubleClick, onShownInfo);
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            GlobalVariables.tutorState = { Main: TutorMainEnum.Hint, Step: 0 };
                            TutorialHelper.Action(GlobalVariables.tutorState);
                        }
                        break;
                }
                ;
                break;
            case TutorMainEnum.Hint:
                switch (state.Step) {
                    case 0:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>2. Hint: Get cards' infomation</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <input type='radio'/><sub>Hint</sub> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to use Hint mode.</div>");
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $("#lbHint").addClass('blink');
                        var onChange = function (ev) {
                            if (PlayOneCategoryPageController.Current.playType != 'hint')
                                return;
                            $(".glyphicon-menu-hamburger").removeClass('blink');
                            $("#lbHint").removeClass('blink');
                            $('#dpPlaySettings').removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>2.1 Hint: Click one card</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub> at first, then click at any one Card.</div>");
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            var onCardClicked = function (ev) {
                                alert("You'll see its answer in the below textblock.");
                                $(GlobalVariables.gdTutorElements.btHide).removeClass('blink');
                                $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                            $('.cvMain .WCard').on(GlobalVariables.onSingleClick, onCardClicked);
                        };
                        $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                        $(PlayOneCategoryPageController.Current.ddSettings).on(GlobalVariables.PlayTypeChangeKey, onChange);
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            GlobalVariables.tutorState = { Main: TutorMainEnum.KeyIn, Step: 0 };
                            TutorialHelper.Action(GlobalVariables.tutorState);
                        }
                        break;
                }
                break;
            case TutorMainEnum.KeyIn:
                switch (state.Step) {
                    case 0:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>3. KeyIn: Annihilate a Card by Input Correct Answer</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <input type='radio'/><sub>KeyIn</sub> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to use Hint mode.</div>");
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $("#lbKeyIn").addClass('blink');
                        var onChange = function (ev) {
                            if (PlayOneCategoryPageController.Current.playType != 'rec')
                                return;
                            $(".glyphicon-menu-hamburger").removeClass('blink');
                            $("#lbKeyIn").removeClass('blink');
                            $('#dpPlaySettings').removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>3.1 KeyIn: Click one card</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub> at first, then click at any one Card.</div>");
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            var onCardClicked = function (ev) {
                                $(GlobalVariables.gdTutorElements.btHide).removeClass('blink');
                                $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            };
                            $('.cvMain .WCard').off(GlobalVariables.onSingleClick, onCardClicked);
                            $('.cvMain .WCard').on(GlobalVariables.onSingleClick, onCardClicked);
                        };
                        $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                        $(PlayOneCategoryPageController.Current.ddSettings).on(GlobalVariables.PlayTypeChangeKey, onChange);
                        break;
                    case 1:
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>3.2 KeyIn: Key in Correct Answer</div>" +
                            "<div style='text-align:center; font-size:3vh;'> Key in CORRECT ANSWER into the textBox </div>");
                        setTimeout(function () {
                            $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>3.2 KeyIn: Key in Correct Answer</div>" +
                                "<div style='text-align:center; font-size:3vh;'> Key in <b>" +
                                PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate
                                + "</b> into the textBox.</div>");
                        }, 1000);
                        $("#tbKeyIn").addClass('blink-background');
                        var onRemove = function (ev) {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            alert("Good Job!");
                            $(PlayOneCategoryPageController.Current.cvMain).off(GlobalVariables.RemoveAWCardKey, onRemove);
                            $("#gdTutorial #btHide").removeClass('blink');
                            $("#tbKeyIn").removeClass('blink-background');
                            if (GlobalVariables.isTutorMode) {
                                GlobalVariables.tutorState.Step++;
                                TutorialHelper.Action(GlobalVariables.tutorState);
                            }
                        };
                        $(PlayOneCategoryPageController.Current.cvMain).off(GlobalVariables.RemoveAWCardKey, onRemove);
                        $(PlayOneCategoryPageController.Current.cvMain).on(GlobalVariables.RemoveAWCardKey, onRemove);
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            PlayOneCategoryPageController.Current.TutorType = TutorMainEnum[TutorMainEnum.End];
                        }
                        break;
                }
                break;
            case TutorMainEnum.End:
                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html("<div style='text-align:center; font-size:5vh;'>Well Done!</div>" +
                    "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub> to stop this tutorial.</div>");
                PlayOneCategoryPageController.scope.$apply(function () { PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn; });
                break;
        }
    };
    return TutorialHelper;
}());
var GlobalVariables = (function () {
    function GlobalVariables() {
    }
    GlobalVariables.categoryListFileName = "MYCategory.json";
    GlobalVariables.containerListFileName = "MYContainer.json";
    GlobalVariables.isHostNameShown = true;
    GlobalVariables.isLog = false;
    GlobalVariables.isIOS = /iP/i.test(navigator.userAgent);
    GlobalVariables.onSingleClick = "onSingleClick";
    GlobalVariables.onDoubleClick = "onDoubleClick";
    GlobalVariables.numCardClick = 0;
    GlobalVariables.timerCardClickId = Number.NaN;
    GlobalVariables.clickedViewCard = null;
    GlobalVariables.PlayType = PlayTypeEnum.syn;
    GlobalVariables.currentDocumentSize = [0, 0];
    GlobalVariables.synthesis = window["speechSynthesis"];
    GlobalVariables.allVoices = undefined;
    GlobalVariables.currentSynVoice = undefined;
    GlobalVariables.synUtterance = undefined;
    GlobalVariables.isTutorMode = true;
    GlobalVariables.tutorState = {
        Main: TutorMainEnum.Begin,
        Step: 0
    };
    GlobalVariables.RemoveAWCardKey = "RemoveAWCard";
    GlobalVariables.SynVoiceChangeKey = "SynVoiceChange";
    GlobalVariables.TutorTypeChangeKey = "TutorTypeChange";
    GlobalVariables.PlayTypeChangeKey = "PlayTypeChange";
    return GlobalVariables;
}());
var MyFileHelper = (function () {
    function MyFileHelper() {
    }
    MyFileHelper.ShowTextFromTxtFile = function (pathOrUrl, tbResult) {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            tbResult.innerText = request.responseText;
        };
        request.send();
    };
    MyFileHelper.FeedTextFromTxtFileToACallBack = function (pathOrUrl, thisCard, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", pathOrUrl, true);
        request.onloadend = function (ev) {
            if (GlobalVariables.isLog) {
                console.log("FeedTextFromTxtFileToACallBack: " + request);
            }
            if ((ev.target).status != 404)
                callback(request.responseText, thisCard);
        };
        request.send();
    };
    return MyFileHelper;
}());
var FileTypeEnum = (function () {
    function FileTypeEnum() {
    }
    FileTypeEnum.Image = 1;
    FileTypeEnum.Text = 2;
    FileTypeEnum.Box = 4;
    FileTypeEnum.Undefined = 8;
    return FileTypeEnum;
}());
var WCard = (function () {
    function WCard(cardInfo, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        this.viewCard = document.createElement("div");
        this._viewSize = [100, 100];
        this._viewPosition = [100, 100];
        this._boxIndex = 0;
        this._mainFolder = "";
        this._categoryFolder = "";
        this.mainFolder = mainFolder;
        this.categoryFolder = categoryFolder;
        this.IniCard(cardInfo);
        var viewCard = this.viewCard;
        var divMove = document.createElement("span");
        $(divMove).addClass('wMove');
        viewCard.appendChild(divMove);
        $(viewCard).on('click', function (ev) {
            var mouseDownTime = WCard.mouseDownTime;
            WCard.mouseDownTime = Date.now();
            if (GlobalVariables.numCardClick === 0 && WCard.mouseDownTime - mouseDownTime > 200)
                return;
            GlobalVariables.numCardClick++;
            GlobalVariables.clickedViewCard = this;
            if (!isNaN(GlobalVariables.timerCardClickId))
                clearTimeout(GlobalVariables.timerCardClickId);
            GlobalVariables.timerCardClickId = setTimeout(function () {
                var num = GlobalVariables.numCardClick;
                var clickedViewCard = GlobalVariables.clickedViewCard;
                var thisWCard = WCard.FindWCardFromViewCard(clickedViewCard);
                if (num == 1) {
                    $(thisWCard.viewCard).trigger(GlobalVariables.onSingleClick);
                    $(thisWCard).trigger(GlobalVariables.onSingleClick);
                }
                else if (num == 2) {
                    $(thisWCard.viewCard).trigger(GlobalVariables.onDoubleClick);
                    $(thisWCard).trigger(GlobalVariables.onDoubleClick);
                }
                else
                    ;
                GlobalVariables.numCardClick = 0;
                GlobalVariables.timerCardClickId = Number.NaN;
                console.log("Click num =" + num);
            }, 300);
        });
        $(viewCard).on('mousedown', function () {
            WCard.mouseDownTime = Date.now();
        });
    }
    Object.defineProperty(WCard.prototype, "viewSize", {
        get: function () { return this._viewSize; },
        set: function (value) {
            this._viewSize = value;
            this.viewCard.style.width = value[0].toString() + "px";
            this.viewCard.style.height = value[1].toString() + "px";
            if (this.cCards)
                for (var i0 = 0; i0 < this.cCards.length; i0++) {
                    if (this.cCards[i0]) {
                        this.cCards[i0].style.width = value[0].toString() + "px";
                        this.cCards[i0].style.height = value[1].toString() + "px";
                    }
                }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "viewPosition", {
        get: function () { return this._viewPosition; },
        set: function (value) {
            this._viewPosition = value;
            $(this.viewCard).animate({
                left: value[0].toString() + "px",
                top: value[1].toString() + "px"
            });
            if (this.cCards)
                for (var i0 = 0; i0 < this.cCards.length; i0++) {
                    if (this.cCards[i0]) {
                        this.cCards[i0].style.left = value[0].toString() + "px";
                        this.cCards[i0].style.top = value[1].toString() + "px";
                    }
                }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "boxIndex", {
        get: function () { return this._boxIndex; },
        set: function (value) {
            this._boxIndex = value;
            if (!this.cCards)
                this.cCards = new Array(this.cardsPath.length);
            var oldCards = this.viewCard.getElementsByClassName(WCard.cardMainKey);
            if (oldCards.length != 0)
                this.viewCard.removeChild(oldCards[0]);
            if (!this.cCards[value]) {
                this.cCards[value] = this.GetcCardFromPath.call(this, this.cardsPath[value], true);
                if (!this.cCards[value]) {
                    this.cCards[value] = this.CardForMessage(WCard.cardMainKey, this.cardsPath[value] + " cannot be opened.");
                }
            }
            if (isNaN(this.viewWHRatio[value]) && this.cCards[value]["naturalHeight"])
                this.viewWHRatio[value] = (this.cCards[value]["naturalWidth"]) / (this.cCards[value]["naturalHeight"]);
            var bufHeight = (isNaN(this.viewWHRatio[value])) ? this.viewSize[1] : (this.viewSize[0] / this.viewWHRatio[value]);
            this.viewSize = [this.viewSize[0], bufHeight];
            this.cCards[value].style.zIndex = "1";
            this.viewCard.appendChild(this.cCards[value]);
            var tbIth = this.viewCard.getElementsByClassName('tbIth')[0];
            if (tbIth)
                tbIth.innerText = (value + 1).toString() + "/" + this.cCards.length.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "mainFolder", {
        get: function () {
            return this._mainFolder;
        },
        set: function (value) {
            this._mainFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WCard.prototype, "categoryFolder", {
        get: function () {
            return this._categoryFolder;
        },
        set: function (value) {
            this._categoryFolder = (value.length != 0 && value.charAt(value.length - 1) === '/') ? value.substr(0, value.length - 1) : value;
        },
        enumerable: true,
        configurable: true
    });
    WCard.prototype.IniCard = function (cardInfo) {
        this.cardInfo = cardInfo;
        var fileName = cardInfo.FileName;
        var theCard = this.GetcCardFromPath.call(this, fileName);
        if (theCard) {
            if (!this.cCards)
                this.cCards = new Array(1);
            this.cCards[0] = theCard;
            this.viewCard.appendChild(theCard);
        }
        if (cardInfo.Size) {
            this.viewSize = cardInfo.Size;
            if (cardInfo.IsSizeFixed === undefined)
                cardInfo.IsSizeFixed = true;
        }
        else
            this.viewSize = [200, 200];
        if (cardInfo.Position) {
            this.viewPosition = cardInfo.Position;
            if (cardInfo.IsXPosFixed === undefined)
                cardInfo.IsXPosFixed = true;
            if (cardInfo.IsYPosFixed === undefined)
                cardInfo.IsYPosFixed = true;
        }
        this.viewCard.style.position = "absolute";
        $(this.viewCard).addClass("WCard");
        if (!this.cardInfo.IsHideShadow)
            $(this.viewCard).addClass("hasShadow");
    };
    WCard.prototype.IniBox = function (stContent, thisWCard) {
        var sentences = stContent.split('\n');
        for (var i0 = 0; i0 < sentences.length; i0++) {
            var sentence = sentences[i0];
            if (sentence.length === 0)
                continue;
            var buf = sentence.split(/(\*\*\*\*\*|\+\+\+\+\+)/);
            if (buf[0] === "*****" || buf[0] === "+++++")
                continue;
            if (!thisWCard.cardsPath) {
                thisWCard.cardsPath = new Array();
                thisWCard.cardsHyperLink = new Array();
                thisWCard.cardsDescription = new Array();
            }
            thisWCard.cardsPath.push(buf[0]);
            var ind = buf.indexOf("*****");
            if (ind != -1 && (ind + 1) < buf.length && buf[ind + 1] != "+++++")
                thisWCard.cardsHyperLink.push(buf[ind + 1]);
            else
                thisWCard.cardsHyperLink.push("");
            ind = buf.indexOf("+++++");
            if (ind != -1 && (ind + 1) < buf.length && buf[ind + 1] != "*****")
                thisWCard.cardsDescription.push(buf[ind + 1]);
            else
                thisWCard.cardsDescription.push("");
        }
        thisWCard.boxIndex = (thisWCard.cardsPath) ? MathHelper.MyRandomN(0, thisWCard.cardsPath.length - 1) : 0;
        if (thisWCard.cardsPath.length > 1 && $(thisWCard.viewCard).children(".btLeft").length === 0) {
            var tbIth = document.createElement('div');
            var btLeft = document.createElement('button');
            var btRight = document.createElement('button');
            btLeft.className = "btLeft";
            btLeft.innerHTML = "<";
            btLeft.style.left = "0";
            btRight.style.top = btLeft.style.top = "50%";
            btRight.style.opacity = btLeft.style.opacity = "0.3";
            btRight.style.position = btLeft.style.position = "absolute";
            btRight.className = "btRight";
            btRight.innerText = ">";
            btRight.style.right = "0";
            tbIth.className = "tbIth";
            tbIth.style.bottom = "0";
            tbIth.style.right = "0";
            tbIth.style.position = "absolute";
            btLeft.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == 0) ? thisWCard.cCards.length - 1 : thisWCard.boxIndex - 1;
                ev.stopPropagation();
            });
            btRight.addEventListener('click', function (ev) {
                thisWCard.boxIndex = (thisWCard.boxIndex == (thisWCard.cCards.length - 1)) ? 0 : thisWCard.boxIndex + 1;
                ev.stopPropagation();
            });
            thisWCard.viewCard.appendChild(btLeft);
            thisWCard.viewCard.appendChild(btRight);
            thisWCard.viewCard.appendChild(tbIth);
        }
    };
    WCard.GetFileType = function (pathOrUrl) {
        pathOrUrl = pathOrUrl.replace('\r', "");
        pathOrUrl = pathOrUrl.replace('\n', " ");
        pathOrUrl = pathOrUrl.trim();
        var iDot = pathOrUrl.lastIndexOf('.');
        var extension = (iDot === 0 || iDot === pathOrUrl.length - 1 || iDot === -1) ? undefined : pathOrUrl.substr(iDot + 1, pathOrUrl.length - iDot - 1);
        extension = extension.toLowerCase();
        if (extension === "txt" || extension === "text") {
            return FileTypeEnum.Text;
        }
        else if (extension === "jpg" || extension === "jpeg" || extension === "gif" || extension === "png" || extension === "bmp") {
            return FileTypeEnum.Image;
        }
        else if (extension === "box") {
            return FileTypeEnum.Box;
        }
        else
            return FileTypeEnum.Undefined;
    };
    WCard.prototype.GetcCardFromPath = function (cardPath, isInsideBox) {
        if (isInsideBox === void 0) { isInsideBox = false; }
        var resObj;
        var fileType = WCard.GetFileType(cardPath);
        var vWHRatio = Number.NaN;
        switch (fileType) {
            case (FileTypeEnum.Image):
                var img = new Image();
                img.className = WCard.cardMainKey;
                img.src = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
                vWHRatio = img.naturalWidth / img.naturalHeight;
                resObj = img;
                break;
            case (FileTypeEnum.Text):
                var tbArea = document.createElement("textarea");
                tbArea.className = WCard.cardMainKey;
                tbArea.readOnly = true;
                MyFileHelper.ShowTextFromTxtFile(CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder), tbArea);
                resObj = tbArea;
                break;
            case (FileTypeEnum.Box):
                if (!isInsideBox) {
                    var pathOrUri = CardsHelper.GetTreatablePath(cardPath, this.mainFolder, this.categoryFolder);
                    MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, this, this.IniBox);
                }
                break;
            case (FileTypeEnum.Undefined):
                break;
        }
        if (fileType === FileTypeEnum.Image || fileType === FileTypeEnum.Text) {
            if (!this.viewWHRatio) {
                if (isInsideBox)
                    this.viewWHRatio = new Array(this.cardsPath.length);
                else
                    this.viewWHRatio = new Array(1);
            }
            this.viewWHRatio[this.boxIndex] = vWHRatio;
        }
        return resObj;
    };
    WCard.prototype.CardForMessage = function (className, stMsg) {
        var resObj;
        return resObj;
    };
    WCard.CleanWCards = function () {
        while (WCard.showedWCards.length > 0) {
            WCard.showedWCards[0].RemoveThisWCard();
        }
        while (WCard.restWCards.length > 0) {
            WCard.restWCards[0].RemoveThisWCard();
        }
    };
    WCard.prototype.RemoveThisWCard = function () {
        var isShown;
        var wcards;
        var self = this;
        if (!self)
            return;
        isShown = (self.viewCard.parentNode != null) ? true : false;
        if (isShown) {
            self.viewCard.parentNode.removeChild(self.viewCard);
            wcards = WCard.showedWCards;
        }
        else
            wcards = WCard.restWCards;
        for (var i0 = 0; i0 < wcards.length; i0++) {
            if (self === wcards[i0]) {
                wcards.splice(i0, 1);
                break;
            }
        }
    };
    WCard.FindWCardFromViewCard = function (viewCard) {
        var wcards = WCard.showedWCards;
        for (var i0 = 0; i0 < wcards.length; i0++) {
            if (viewCard === wcards[i0].viewCard) {
                return wcards[i0];
            }
        }
    };
    WCard.showedWCards = new Array();
    WCard.restWCards = new Array();
    WCard.cardMainKey = "cardMain";
    WCard.btLeftClickKey = "btLeftClick";
    WCard.btRightClickKey = "btRightClick";
    return WCard;
}());
var PlayOneCategoryPageController = (function () {
    function PlayOneCategoryPageController($scope, $routeParams) {
        this.meCardsAudio = document.getElementById('meCardsAudio');
        this.meBackground = document.getElementById('meBackground');
        this.dlDblClickWCard = document.getElementById('dlDblClickWCard');
        this.dlFinish = document.getElementById('dlFinish');
        this.ddSettings = document.getElementById('ddSettings');
        this.imgBackground = document.getElementById('imgBackground');
        this.btSynPlay = document.getElementById('btSynPlay');
        this.btLangSettings = document.getElementById('dropdownLangSettings');
        this.rdTutorType = document.getElementById('rdTutorType');
        this.cvMain = document.getElementsByClassName('cvMain')[0];
        this.isBackAudioStartLoad = false;
        this.isBGAlsoChange = true;
        this.defaultCardStyle = { width: "16vw", height: "16vh" };
        this.maxDelScore = 20;
        this.pgScore = document.getElementById('pgScore');
        this._rate2PowN = 0;
        this.onPlayBGSound = function (ev) {
            PlayOneCategoryPageController.Current.meBackground.load();
            PlayOneCategoryPageController.Current.meBackground.play();
        };
        this.onReloadSynVoices = function (ev) {
            SpeechSynthesisHelper.getAllVoices(PlayOneCategoryPageController.Current.GetCurrentSynVoice);
            SpeechSynthesisHelper.getAllVoices(function () {
                if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
                    var stVoice = "{";
                    for (var key in PlayOneCategoryPageController.Current.currentSynVoice) {
                        stVoice += key + ": " + PlayOneCategoryPageController.Current.currentSynVoice[key] + ";\n";
                    }
                    stVoice += "}";
                    alert("SynLang: " + PlayOneCategoryPageController.Current.SynLang + " ." + "Has allVoices." + "\n" +
                        "CurrentVoice: " + stVoice);
                }
                else
                    alert("No Voice." + " isIOS=" + GlobalVariables.isIOS);
            });
        };
        this.onWindowResize = function (ev) {
            if (GlobalVariables.currentDocumentSize[0] === $(document).innerWidth() && GlobalVariables.currentDocumentSize[1] === $(document).innerHeight())
                return;
            GlobalVariables.currentDocumentSize[0] = $(document).innerWidth();
            GlobalVariables.currentDocumentSize[1] = $(document).innerHeight();
            var wcards = WCard.showedWCards;
            CardsHelper.RearrangeCards(wcards, PlayOneCategoryPageController.oneOverNWindow);
        };
        this.ShowNewWCards_Click = function () {
            if (PlayOneCategoryPageController.Current.selWCard)
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
            var bufWCards = new Array();
            var shWCards = WCard.showedWCards;
            var rtWCards = WCard.restWCards;
            var N = PlayOneCategoryPageController.numWCardShown;
            var nShToRt = Math.max(0, shWCards.length + Math.min(rtWCards.length, N) - N);
            CardsHelper.MoveArrayElements(shWCards, bufWCards, nShToRt, PlayOneCategoryPageController.isPickWCardsRandomly);
            CardsHelper.MoveArrayElements(rtWCards, shWCards, N, PlayOneCategoryPageController.isPickWCardsRandomly, $(".cvMain"));
            CardsHelper.MoveArrayElements(bufWCards, rtWCards, nShToRt);
            PlayOneCategoryPageController.Current.numRestWCards;
            CardsHelper.RearrangeCards(shWCards, PlayOneCategoryPageController.oneOverNWindow);
        };
        this.Smaller_Click = function (ev) {
            PlayOneCategoryPageController.oneOverNWindow *= 1.2;
            CardsHelper.RearrangeCards(WCard.restWCards, PlayOneCategoryPageController.oneOverNWindow, false, false, 1 / 1.2, true);
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true, 1 / 1.2);
            if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
                var bGObj = PlayOneCategoryPageController.Current.imgBackground;
                $(bGObj).css({
                    'width': Math.round(bGObj.clientWidth / 1.2) + "px",
                    'height': Math.round(bGObj.clientHeight / 1.2) + "px"
                });
            }
            ev.stopPropagation();
        };
        this.Larger_Click = function (ev) {
            PlayOneCategoryPageController.oneOverNWindow /= 1.2;
            CardsHelper.RearrangeCards(WCard.restWCards, PlayOneCategoryPageController.oneOverNWindow, false, false, 1.2, true);
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true, 1.2);
            if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
                var bGObj = PlayOneCategoryPageController.Current.imgBackground;
                $(bGObj).css({
                    'width': Math.round(bGObj.clientWidth * 1.2) + "px",
                    'height': Math.round(bGObj.clientHeight * 1.2) + "px"
                });
            }
            ev.stopPropagation();
        };
        this.Arrange_Click = function (isRandomly) {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, isRandomly, false);
        };
        this.OpenHyperLink_Click = function () {
            if (PlayOneCategoryPageController.Current.hyperLink)
                window.open(PlayOneCategoryPageController.Current.hyperLink);
        };
        this.synPlay_Click = function (ev) {
            if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                PlayOneCategoryPageController.Current.synPlayNext_Click(null);
            }
            if (PlayOneCategoryPageController.Current.synAnsWCard) {
                var synAnsWCard = PlayOneCategoryPageController.Current.synAnsWCard;
                PlayOneCategoryPageController.Current.PlayAudio(synAnsWCard);
                if (!PlayOneCategoryPageController.Current.scoreTimerId) {
                    PlayOneCategoryPageController.Current.localMinusScore = 0;
                    PlayOneCategoryPageController.Current.scoreTimerId = setInterval(function () {
                        if ($(PlayOneCategoryPageController.Current.ddSettings).css('display') != 'none')
                            return;
                        PlayOneCategoryPageController.Current.localMinusScore++;
                        var score = PlayOneCategoryPageController.Current.localMinusScore;
                        if (score > PlayOneCategoryPageController.Current.maxDelScore) {
                            clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                            PlayOneCategoryPageController.Current.scoreTimerId = null;
                        }
                        else {
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.totalScore--;
                            });
                        }
                    }, 1000);
                }
            }
        };
        this.synPlayNext_Click = function (ev) {
            var wcards = WCard.showedWCards;
            if (wcards.length === 0) {
                PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                wcards = WCard.showedWCards;
            }
            if (wcards.length === 0) {
                PlayOneCategoryPageController.Current.ShowdlFinish();
                return;
            }
            var ith = MathHelper.MyRandomN(0, wcards.length - 1);
            var ithOld = wcards.indexOf(PlayOneCategoryPageController.Current.synAnsWCard);
            if (ithOld < 0)
                ith = MathHelper.MyRandomN(0, wcards.length - 1);
            else {
                ith = MathHelper.MyRandomN(0, wcards.length - 2);
                ith = (ith < ithOld) ? ith : ith + 1;
            }
            PlayOneCategoryPageController.Current.synAnsWCard = wcards[ith];
            PlayOneCategoryPageController.Current.synPlay_Click(ev);
        };
        this.recCheckAnswer_Click = function () {
            if (PlayOneCategoryPageController.Current.selWCard && PlayOneCategoryPageController.Current.recInputSentence && PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate.trim().
                indexOf(PlayOneCategoryPageController.Current.recInputSentence.trim()) === 0) {
                $(PlayOneCategoryPageController.Current.selWCard.viewCard).animate({ opacity: 0.1 }, {
                    duration: 100,
                    step: function (now, fx) {
                        $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                    },
                    complete: function () {
                        if (GlobalVariables.isTutorMode)
                            $(PlayOneCategoryPageController.Current.cvMain).trigger(GlobalVariables.RemoveAWCardKey);
                        if (PlayOneCategoryPageController.Current.selWCard)
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                        PlayOneCategoryPageController.Current.selWCard = null;
                        if (WCard.showedWCards.length === 0)
                            PlayOneCategoryPageController.Current.ShowNewWCards_Click();
                        if (WCard.showedWCards.length === 0) {
                            PlayOneCategoryPageController.Current.ShowdlFinish();
                            return;
                        }
                    }
                });
            }
            else {
                if (PlayOneCategoryPageController.Current.selWCard) {
                    alert("Your answer is wrong.");
                    PlayOneCategoryPageController.Current.totalScore -= 3;
                }
                else {
                    alert("Click a card at first.");
                }
            }
        };
        VersionHelper.ReloadIfNeeded();
        PlayOneCategoryPageController.Current = this;
        PlayOneCategoryPageController.scope = $scope;
        WCard.CleanWCards();
        if (GlobalVariables.isTutorMode) {
            this.TutorType = TutorMainEnum[TutorMainEnum.Begin];
            TutorialHelper.Action(GlobalVariables.tutorState);
        }
        $scope.$on('$routeChangeStart', function (ev, next, current) {
            PlayOneCategoryPageController.Current.ClearBeforeLeavePage();
        });
        if (GlobalVariables.isIOS)
            $(PlayOneCategoryPageController.Current.imgBackground).css('cursor', 'pointer');
        this.btSynPlay.addEventListener("click", this.synPlay_Click);
        GlobalVariables.currentDocumentSize = [$(document).innerWidth(), $(document).innerHeight()];
        $(this.dlDblClickWCard).dialog({ autoOpen: false, modal: true });
        $(this.dlFinish).dialog({
            autoOpen: false, modal: true, dialogClass: "no-close",
            buttons: [{
                    text: "OK",
                    click: function () {
                        if (history.length > 1)
                            history.back();
                        else
                            location.href = "/";
                        $(PlayOneCategoryPageController.Current.dlFinish).dialog('close');
                    }
                }]
        });
        if ($routeParams["Container"] != undefined)
            GlobalVariables.currentMainFolder = $routeParams["Container"];
        if ($routeParams["CFolder"] != undefined)
            GlobalVariables.currentCategoryFolder = $routeParams["CFolder"];
        this.Container = GlobalVariables.currentMainFolder;
        this.CFolder = GlobalVariables.currentCategoryFolder;
        this.topNavbarHeight = $("#topNavbar").height();
        this.bottomNavbarHeight = $("#bottomNavbar").height();
        this.numWCardShown = 8;
        this.isPickWCardsRandomly = true;
        var pathOrUri = CardsHelper.GetTreatablePath(GlobalVariables.categoryListFileName, this.Container, this.CFolder);
        if (GlobalVariables.isLog)
            console.log("PlayOneCategoryPage:constructor:pathOrUri= " + pathOrUri);
        MyFileHelper.FeedTextFromTxtFileToACallBack(pathOrUri, WCard.restWCards, ShowWCardsAndEventsCallback);
        $(window).on("resize", PlayOneCategoryPageController.Current.onWindowResize);
        setTimeout(function () {
            CardsHelper.RearrangeCards(WCard.showedWCards, PlayOneCategoryPageController.oneOverNWindow, false, true);
        }, 2500);
    }
    Object.defineProperty(PlayOneCategoryPageController.prototype, "totalScore", {
        get: function () {
            return this._totalScore;
        },
        set: function (value) {
            this._totalScore = (value >= 0) ? value : 0;
            $(this.pgScore).css('width', Math.floor(value / this.glScore * 100).toString() + "%");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "rate2PowN", {
        get: function () {
            return this._rate2PowN;
        },
        set: function (value) {
            var meAud = this.meCardsAudio;
            meAud.defaultPlaybackRate = Math.pow(2, value);
            this._rate2PowN = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "numWCardShown", {
        get: function () {
            return PlayOneCategoryPageController.numWCardShown;
        },
        set: function (value) {
            PlayOneCategoryPageController.numWCardShown = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "isPickWCardsRandomly", {
        get: function () {
            return PlayOneCategoryPageController.isPickWCardsRandomly;
        },
        set: function (value) {
            PlayOneCategoryPageController.isPickWCardsRandomly = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "numRestWCards", {
        get: function () {
            return WCard.restWCards.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "playType", {
        get: function () {
            return GlobalVariables.PlayType;
        },
        set: function (value) {
            if (GlobalVariables.PlayType != value) {
                if (value === PlayTypeEnum.rec) {
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                        PlayOneCategoryPageController.Current.localMinusScore = 0;
                    }
                }
                else if (value === PlayTypeEnum.hint) {
                    PlayOneCategoryPageController.Current.totalScore -= PlayOneCategoryPageController.Current.maxDelScore;
                }
                GlobalVariables.PlayType = value;
                if (PlayOneCategoryPageController.Current.selWCard) {
                    $(PlayOneCategoryPageController.Current.selWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                }
                $(PlayOneCategoryPageController.Current.ddSettings).trigger(GlobalVariables.PlayTypeChangeKey);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "synAllVoices", {
        get: function () {
            return GlobalVariables.allVoices;
        },
        set: function (value) {
            GlobalVariables.allVoices = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "currentSynVoice", {
        get: function () { return this._currentSynVoice; },
        set: function (value) {
            if (value != this._currentSynVoice) {
                this._currentSynVoice = value;
                this.SynLang = value.lang;
                if (GlobalVariables.isTutorMode) {
                    $(PlayOneCategoryPageController.Current.btLangSettings).trigger(GlobalVariables.SynVoiceChangeKey);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayOneCategoryPageController.prototype, "TutorType", {
        get: function () {
            return TutorMainEnum[GlobalVariables.tutorState.Main];
        },
        set: function (value) {
            if (value === TutorMainEnum[GlobalVariables.tutorState.Main])
                return;
            $(PlayOneCategoryPageController.Current.rdTutorType).trigger(GlobalVariables.TutorTypeChangeKey);
            GlobalVariables.isTutorMode = true;
            $(PlayOneCategoryPageController.Current.rdTutorType).prop('disabled', true);
            switch (value) {
                case TutorMainEnum[TutorMainEnum.Begin]:
                    GlobalVariables.isTutorMode = true;
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeProp('disabled');
                    GlobalVariables.tutorState = { Main: TutorMainEnum.Begin, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.Basic]:
                    GlobalVariables.tutorState = { Main: TutorMainEnum.Basic, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.Hint]:
                    GlobalVariables.tutorState = { Main: TutorMainEnum.Hint, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.KeyIn]:
                    GlobalVariables.tutorState = { Main: TutorMainEnum.KeyIn, Step: 0 };
                    break;
                case TutorMainEnum[TutorMainEnum.End]:
                    GlobalVariables.isTutorMode = false;
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeAttr('disabled');
                    GlobalVariables.tutorState = { Main: TutorMainEnum.End, Step: 0 };
                    PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn;
                    break;
                default:
                    GlobalVariables.isTutorMode = false;
                    $(PlayOneCategoryPageController.Current.rdTutorType).removeProp('disabled');
                    break;
            }
            TutorialHelper.Action(GlobalVariables.tutorState);
        },
        enumerable: true,
        configurable: true
    });
    PlayOneCategoryPageController.prototype.ClearBeforeLeavePage = function () {
        $(window).off('resize', PlayOneCategoryPageController.Current.onWindowResize);
        $(document).off('click', PlayOneCategoryPageController.Current.onPlayBGSound);
        if (PlayOneCategoryPageController.Current.scoreTimerId)
            clearTimeout(PlayOneCategoryPageController.Current.scoreTimerId);
        $(GlobalVariables.gdTutorElements.gdMain).hide(0);
    };
    PlayOneCategoryPageController.prototype.SetGlobalScore = function (wcards) {
        this.glScore = this.maxDelScore * wcards.length;
        this.totalScore = this.glScore;
    };
    PlayOneCategoryPageController.prototype.GetCurrentSynVoice = function () {
        PlayOneCategoryPageController.scope.$apply(function () {
            if (GlobalVariables.currentSynVoice)
                PlayOneCategoryPageController.Current.currentSynVoice = GlobalVariables.currentSynVoice;
            else if (GlobalVariables.allVoices && GlobalVariables.allVoices.length > 0) {
                var allVoices = GlobalVariables.allVoices;
                PlayOneCategoryPageController.Current.synAllVoices = null;
                PlayOneCategoryPageController.Current.synAllVoices = allVoices;
                var vVoice;
                if (PlayOneCategoryPageController.Current.SynLang)
                    vVoice = SpeechSynthesisHelper.getSynVoiceFromLang(PlayOneCategoryPageController.Current.SynLang);
                PlayOneCategoryPageController.Current.currentSynVoice = (vVoice) ? vVoice : GlobalVariables.allVoices[0];
            }
        });
    };
    ;
    PlayOneCategoryPageController.prototype.ShowdlFinish = function () {
        var nFinal = PlayOneCategoryPageController.Current.totalScore;
        var nAll = PlayOneCategoryPageController.Current.glScore;
        PlayOneCategoryPageController.scope.$apply(function () {
            PlayOneCategoryPageController.Current.level = Math.max(0, Math.round((nFinal / nAll - 0.5) * 20));
        });
        $(PlayOneCategoryPageController.Current.dlFinish).dialog('open');
        PlayOneCategoryPageController.Current.meBackground.pause();
    };
    PlayOneCategoryPageController.prototype.PlayAudio = function (wCard) {
        if (wCard.cardInfo.AudioFilePathOrUri) {
            var meAud = PlayOneCategoryPageController.Current.meCardsAudio;
            meAud.src = CardsHelper.GetTreatablePath(wCard.cardInfo.AudioFilePathOrUri, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
            meAud.load();
            meAud.play();
        }
        else if (GlobalVariables.synthesis && GlobalVariables.synUtterance) {
            SpeechSynthesisHelper.Speak(wCard.cardInfo.Dictate, PlayOneCategoryPageController.Current.SynLang, PlayOneCategoryPageController.Current.currentSynVoice, Math.pow(2, PlayOneCategoryPageController.Current.rate2PowN));
        }
    };
    ;
    PlayOneCategoryPageController.oneOverNWindow = 5;
    PlayOneCategoryPageController.styleSelWCard = "selWCard";
    return PlayOneCategoryPageController;
}());
function ShowWCardsAndEventsCallback(jsonTxt, restWcards) {
    var showedWcards = WCard.showedWCards;
    var ith = 0;
    var jObj = JSON.parse(jsonTxt);
    PlayOneCategoryPageController.scope.$apply(function () {
        if (jObj.numWCardShown)
            PlayOneCategoryPageController.numWCardShown = jObj.numWCardShown;
        if (jObj.isBGAlsoChange)
            PlayOneCategoryPageController.Current.isBGAlsoChange = jObj.isBGAlsoChange;
        if (jObj.isPickWCardsRandomly)
            PlayOneCategoryPageController.isPickWCardsRandomly = jObj.isPickWCardsRandomly;
    });
    PlayOneCategoryPageController.Current.SynLang = jObj.SynLang;
    SpeechSynthesisHelper.getAllVoices(PlayOneCategoryPageController.Current.GetCurrentSynVoice);
    CardsHelper.GetWCardsCallback(jObj, restWcards);
    PlayOneCategoryPageController.Current.hyperLink = jObj.Link;
    if (jObj["Background"]) {
        var bgSettings = jObj.Background;
        if (bgSettings.ImgStyle) {
            var myStyle = bgSettings.ImgStyle;
            myStyle = CardsHelper.CorrectBackgroundStyle(myStyle, PlayOneCategoryPageController.Current.Container, PlayOneCategoryPageController.Current.CFolder);
            $(PlayOneCategoryPageController.Current.imgBackground).css(myStyle);
        }
        if (bgSettings.AudioProperties) {
            $(PlayOneCategoryPageController.Current.meBackground).prop(bgSettings.AudioProperties);
            $(document).one("click", PlayOneCategoryPageController.Current.onPlayBGSound);
        }
    }
    PlayOneCategoryPageController.Current.SetGlobalScore(restWcards);
    for (var i0 = 0; i0 < restWcards.length; i0++) {
        $(restWcards[i0]).on(GlobalVariables.onSingleClick, { thisWCard: restWcards[i0] }, function (ev) {
            var prevWCard = PlayOneCategoryPageController.Current.selWCard;
            var selWCard = ev.data.thisWCard;
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = selWCard;
            });
            if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.syn) {
                if (selWCard === PlayOneCategoryPageController.Current.synAnsWCard) {
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        clearInterval(PlayOneCategoryPageController.Current.scoreTimerId);
                        PlayOneCategoryPageController.Current.scoreTimerId = null;
                    }
                    $(selWCard.viewCard).animate({ opacity: 0.1 }, {
                        duration: 200,
                        step: function (now, fx) {
                            $(this).css('transform', 'scale(' + 1 / now + ',' + 1 / now + ')');
                        },
                        complete: function () {
                            PlayOneCategoryPageController.Current.selWCard.RemoveThisWCard();
                            PlayOneCategoryPageController.Current.synAnsWCard = null;
                            PlayOneCategoryPageController.Current.synPlayNext_Click(null);
                            PlayOneCategoryPageController.scope.$apply(function () {
                                PlayOneCategoryPageController.Current.synAnsWCard;
                            });
                            if (GlobalVariables.isTutorMode)
                                $(PlayOneCategoryPageController.Current.btSynPlay).trigger(GlobalVariables.RemoveAWCardKey);
                        }
                    });
                }
                else {
                    if (!PlayOneCategoryPageController.Current.synAnsWCard) {
                        return;
                    }
                    if (PlayOneCategoryPageController.Current.scoreTimerId) {
                        var delScore = 2;
                        if (PlayOneCategoryPageController.Current.localMinusScore + 2 > PlayOneCategoryPageController.Current.maxDelScore) {
                            delScore = Math.max(0, PlayOneCategoryPageController.Current.maxDelScore - PlayOneCategoryPageController.Current.localMinusScore);
                        }
                        PlayOneCategoryPageController.Current.totalScore -= delScore;
                        PlayOneCategoryPageController.Current.localMinusScore += 2;
                    }
                    $(selWCard.viewCard).animate({ opacity: 0.5 }, {
                        duration: 100,
                        step: function (now, fx) {
                            $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                        },
                        complete: function () {
                            $(this).animate({ opacity: 1 }, {
                                duration: 100,
                                step: function (now, fx) {
                                    $(this).css('transform', 'rotate(' + (1 - now) * 360 + 'deg)');
                                }
                            });
                        }
                    });
                }
            }
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.rec) {
                if (prevWCard)
                    $(prevWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
            }
            else if (PlayOneCategoryPageController.Current.playType === PlayTypeEnum.hint) {
                if (prevWCard)
                    $(prevWCard.viewCard).removeClass(PlayOneCategoryPageController.styleSelWCard);
                $(selWCard.viewCard).addClass(PlayOneCategoryPageController.styleSelWCard);
                PlayOneCategoryPageController.Current.PlayAudio(selWCard);
            }
        });
        $(restWcards[i0]).on(GlobalVariables.onDoubleClick, { thisWCard: restWcards[i0] }, function (ev) {
            PlayOneCategoryPageController.scope.$apply(function () {
                PlayOneCategoryPageController.Current.selWCard = ev.data.thisWCard;
            });
            var selWCard = PlayOneCategoryPageController.Current.selWCard;
            CardsHelper.ShowHLinkAndDesDialog(selWCard, PlayOneCategoryPageController.Current.dlDblClickWCard);
        });
        if (!restWcards[i0].cardInfo.IsXPosFixed || !restWcards[i0].cardInfo.IsYPosFixed)
            $(restWcards[i0].viewCard).draggable();
        if (!restWcards[i0].cardInfo.IsSizeFixed)
            $(restWcards[i0].viewCard).resizable();
        $(restWcards[i0].viewCard).on("resize", function (ev, ui) {
            ev.bubbles = false;
            var thisWCard = WCard.FindWCardFromViewCard(this);
            thisWCard.viewSize = [ui.size.width, ui.size.height];
        });
        restWcards[i0].viewCard.style.msTouchAction = "manipulation";
        restWcards[i0].viewCard.style.touchAction = "manipulation";
    }
    while (ith < PlayOneCategoryPageController.numWCardShown && restWcards.length > 0) {
        $(restWcards[0].viewCard).appendTo(".cvMain");
        showedWcards.push(restWcards[0]);
        restWcards.splice(0, 1);
        ith++;
    }
    PlayOneCategoryPageController.scope.$apply(function () {
        PlayOneCategoryPageController.Current.numRestWCards;
    });
    var newRate = 1;
    if ($(document).height() * 1.1 > $(window).height())
        newRate = $(window).height() / ($(document).height() * 1.1);
    CardsHelper.RearrangeCards(showedWcards, PlayOneCategoryPageController.oneOverNWindow, false, true, newRate, false);
    if (PlayOneCategoryPageController.Current.isBGAlsoChange) {
        var bGObj = PlayOneCategoryPageController.Current.imgBackground;
        $(bGObj).css({
            'width': Math.round(bGObj.clientWidth * newRate) + "px",
            'height': Math.round(bGObj.clientHeight * newRate) + "px"
        });
    }
}
var app = angular.module('MYCWeb', ['ngRoute', 'ngAnimate']);
app.controller('PlayOneCategoryPageController', ['$scope', '$routeParams', PlayOneCategoryPageController]);
app.controller('ChooseAContainerPageController', ['$scope', '$routeParams', ChooseAContainerPageController]);
app.config(function ($routeProvider, $locationProvider) {
    SpeechSynthesisHelper.getAllVoices(function () { });
    GlobalVariables.gdTutorElements = {
        gdMain: document.getElementById("gdTutorial"),
        gdBoard: $("#gdTutorial #gdBoard").get(0),
        gdContent: $("#gdTutorial #gdContent").get(0),
        btHide: $("#gdTutorial #btHide").get(0),
        btStop: $("#gdTutorial #btStop").get(0)
    };
    $routeProvider
        .when('/Play', {
        templateUrl: GlobalVariables.playOneCategoryHtml,
        controller: 'PlayOneCategoryPageController',
        controllerAs: 'ctrl'
    })
        .when('/', {
        templateUrl: GlobalVariables.chooseAContainerHtml,
        controller: 'ChooseAContainerPageController',
        controllerAs: 'ctrl'
    });
});
var myVersion = (function () {
    function myVersion() {
        this.version = GlobalVariables.version;
    }
    return myVersion;
}());
var VersionHelper = (function () {
    function VersionHelper() {
    }
    VersionHelper.ReloadIfNeeded = function () {
        MyFileHelper.FeedTextFromTxtFileToACallBack(GlobalVariables.versionFile + "?nocache=" + Date.now(), null, function (stJSON, buf) {
            try {
                var jObj = JSON.parse(stJSON);
            }
            catch (exc) {
                console.log("VersionHelper:JSON.parse error:" + exc.message);
                return;
            }
            if (GlobalVariables.isLog)
                console.log("old one:" + GlobalVariables.version + "  ,new one:" + jObj.version);
            if (jObj.version && jObj.version != GlobalVariables.version) {
                location.reload(true);
            }
        });
        return;
    };
    ;
    return VersionHelper;
}());
function ChooseAContainerPageController($scope) {
    VersionHelper.ReloadIfNeeded();
    if (GlobalVariables.isLog) {
        console.log("ChooseAContainerPageController in");
        console.log(location.origin);
    }
    var self = this;
    self.containers = GlobalVariables.containers;
    self.selContainer = self.containers[0];
    self.categories;
    self.selCategory;
    self.GetPath = function () {
        var pathOrUrl = self.selContainer.itsLocation + "/" + GlobalVariables.containerListFileName;
        if (GlobalVariables.isHostNameShown)
            pathOrUrl = location.origin + pathOrUrl;
        return pathOrUrl;
    };
    self.onConChange = function onContainerChange() {
        MyFileHelper.FeedTextFromTxtFileToACallBack(self.GetPath(), self.categories, self.UpdateCategories);
    };
    self.UpdateCategories = function (jsonTxt, categories) {
        if (GlobalVariables.isLog) {
            console.log("ChooseAContainerPage:UpdateCategories: " + jsonTxt);
        }
        var obj = JSON.parse(jsonTxt);
        self.categories = [];
        categories = [];
        for (var i0 = 0; i0 < obj.Categories.length; i0++) {
            categories.push(obj.Categories[i0]);
        }
        $scope.$apply(function () {
            self.categories = categories;
            if (categories.length > 0)
                self.selCategory = categories[0];
        });
    };
    self.onConChange();
}
var AContainer = (function () {
    function AContainer(pos) {
        this.itsLocation = pos;
    }
    return AContainer;
}());
var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.Permute = function (oldSet) {
        var newSet = new Array();
        while (oldSet.length > 0) {
            var i0 = MathHelper.MyRandomN(0, oldSet.length - 1);
            newSet.push(oldSet[i0]);
            oldSet.splice(i0, 1);
        }
        for (var i0 = 0; i0 < newSet.length; i0++) {
            oldSet.push(newSet[i0]);
        }
        return newSet;
    };
    MathHelper.MyRandomN = function (iStart, iEnd) {
        var ith;
        ith = Math.floor((iEnd - iStart + 1 - 1e-10) * Math.random() + iStart);
        return ith;
    };
    return MathHelper;
}());
var CardsHelper = (function () {
    function CardsHelper() {
    }
    CardsHelper.RearrangeCards = function (wcards, nCol, isRandom, isOptimizeSize, expandRatio, justFixed) {
        if (nCol === void 0) { nCol = 5; }
        if (isRandom === void 0) { isRandom = false; }
        if (isOptimizeSize === void 0) { isOptimizeSize = true; }
        if (expandRatio === void 0) { expandRatio = 1; }
        if (justFixed === void 0) { justFixed = false; }
        if (!wcards || wcards.length === 0)
            return;
        var topOfTop = 50;
        var currentPosition = [0, topOfTop];
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight - topOfTop;
        if (isRandom)
            MathHelper.Permute(wcards);
        var maxWidth = 0;
        for (var i1 = 0; i1 < wcards.length; i1++) {
            var card = wcards[i1];
            if (!card.cardInfo.IsSizeFixed && !justFixed) {
                var size = [wWidth / nCol, wHeight / nCol];
                if (!card.viewWHRatio)
                    card.viewWHRatio = new Array();
                if (card.cCards != undefined && card.cCards[card.boxIndex] != undefined && isNaN(card.viewWHRatio[card.boxIndex])) {
                    var nWidth = card.cCards[card.boxIndex]["naturalWidth"];
                    var nHeight = card.cCards[card.boxIndex]["naturalHeight"];
                    if (nWidth != undefined && nWidth > 0 && nHeight > 0)
                        card.viewWHRatio[card.boxIndex] = nWidth / nHeight;
                }
                if (card.viewWHRatio && !isNaN(card.viewWHRatio[card.boxIndex])) {
                    size[1] = size[0] / card.viewWHRatio[card.boxIndex];
                }
                if (isOptimizeSize)
                    card.viewSize = size;
            }
            else if (card.cardInfo.IsSizeFixed) {
                for (var i0 = 0; i0 < card.viewSize.length; i0++) {
                    card.viewSize[i0] *= expandRatio;
                }
                card.viewSize = card.viewSize;
            }
            if ((!card.cardInfo.IsXPosFixed || !card.cardInfo.IsYPosFixed) && !justFixed) {
                var predictTop = currentPosition[1] + card.viewSize[1] + 20;
                if (predictTop > wHeight) {
                    currentPosition = [currentPosition[0] + maxWidth + 20, topOfTop];
                    maxWidth = card.viewSize[0];
                }
                else {
                    maxWidth = Math.max(maxWidth, card.viewSize[0]);
                }
                card.viewPosition = currentPosition;
                if (predictTop < wHeight)
                    currentPosition[1] = predictTop;
                else
                    currentPosition[1] += card.viewSize[1] + 20;
            }
            else if (card.cardInfo.IsXPosFixed && card.cardInfo.IsYPosFixed) {
                for (var i0 = 0; i0 < card.viewPosition.length; i0++) {
                    card.viewPosition[i0] *= expandRatio;
                }
                card.viewPosition = card.viewPosition;
            }
        }
        PlayOneCategoryPageController.Current.defaultCardHeight = wcards[0].viewCard.clientHeight;
        PlayOneCategoryPageController.Current.defaultCardWidth = wcards[0].viewCard.clientWidth;
    };
    CardsHelper.GetTreatablePath = function (cardPath, mainFolder, categoryFolder) {
        if (mainFolder === void 0) { mainFolder = ""; }
        if (categoryFolder === void 0) { categoryFolder = ""; }
        var newPath;
        var hasProtocol = true;
        if (cardPath.toLowerCase().indexOf("http://") === 0 || cardPath.toLowerCase().indexOf("https://") === 0)
            newPath = cardPath;
        else if (cardPath.toLowerCase().indexOf("file://") === 0)
            newPath = cardPath;
        else if (cardPath.charAt(0) === '/' || cardPath.charAt(0) === '\\') {
            newPath = mainFolder + cardPath.replace('\\', '/');
            hasProtocol = false;
        }
        else {
            newPath = mainFolder + "/" + categoryFolder + "/" + cardPath.replace('\\', '/');
            hasProtocol = false;
        }
        if (!hasProtocol && GlobalVariables.isHostNameShown) {
            newPath = location.origin + newPath;
        }
        return newPath;
    };
    CardsHelper.GetWCardsCallback = function (jObj, cards) {
        if (!jObj)
            return;
        var des = jObj.Cards;
        if (!des)
            return;
        for (var i0 = 0; i0 < des.length; i0++) {
            var eachDescription = des[i0];
            CardsHelper.UpdateEachDescription(des[i0]);
            var card = new WCard(eachDescription, GlobalVariables.currentMainFolder, GlobalVariables.currentCategoryFolder);
            if (card)
                cards.push(card);
        }
    };
    CardsHelper.UpdateEachDescription = function (des) {
        if (!des.Dictate && des.FileName) {
            var iDot = des.FileName.lastIndexOf('.');
            if (iDot > 0)
                des.Dictate = decodeURIComponent(des.FileName.substring(0, iDot));
            if (des.Dictate[0].toLowerCase() === 's') {
                if (/^[s,S][0-9]+\./.test(des.Dictate)) {
                    iDot = des.Dictate.indexOf('.');
                    des.Dictate = des.Dictate.substring(iDot + 1).trim();
                }
            }
        }
    };
    CardsHelper.MoveArrayElements = function (from, to, numToMove, isRandomly, myAppendTo) {
        if (isRandomly === void 0) { isRandomly = false; }
        if (myAppendTo === void 0) { myAppendTo = null; }
        var i0 = 0;
        while (i0 < numToMove && from.length > 0) {
            i0++;
            var ith = (isRandomly) ?
                MathHelper.MyRandomN(0, from.length - 1) :
                0;
            to.push(from[ith]);
            if (myAppendTo) {
                var shWCard = from[ith];
                if (shWCard)
                    $(shWCard.viewCard).appendTo(myAppendTo);
            }
            else {
                var wcard = from[ith];
                if (wcard && wcard.viewCard.parentNode) {
                    wcard.viewCard.parentNode.removeChild(wcard.viewCard);
                }
            }
            from.splice(ith, 1);
        }
    };
    CardsHelper.ShowHLinkAndDesDialog = function (wcard, diEle) {
        var btns = new Array();
        var isLinking = false;
        var isDescripted = false;
        var inStr1, inStr2;
        if (wcard.cardInfo.Link) {
            inStr1 = wcard.cardInfo.Link;
            isLinking = true;
        }
        else if (wcard.cardsHyperLink && wcard.boxIndex >= 0 && wcard.cardsHyperLink[wcard.boxIndex]) {
            inStr1 = wcard.cardsHyperLink[wcard.boxIndex];
            isLinking = true;
        }
        else
            isLinking = false;
        if (isLinking) {
            btns.push({
                text: 'Link',
                click: function () {
                    window.open(inStr1);
                    $(diEle).dialog('close');
                }
            });
        }
        if (wcard.cardInfo.Description) {
            inStr2 = wcard.cardInfo.Description;
            isDescripted = true;
        }
        else if (wcard.cardsDescription && wcard.boxIndex >= 0 && wcard.cardsDescription[wcard.boxIndex]) {
            inStr2 = wcard.cardsDescription[wcard.boxIndex];
            isDescripted = true;
        }
        else
            isDescripted = false;
        if (isLinking || isDescripted) {
            $(diEle).dialog({
                buttons: btns
            });
            if (isDescripted)
                $(diEle).html("Description:<br/>" + inStr2);
            else
                $(diEle).html("No Description but it has a link.");
            $(diEle).dialog('open');
        }
    };
    CardsHelper.CorrectBackgroundStyle = function (myStyle, stContainer, stCFolder) {
        var bgImgStyle = myStyle["background-image"];
        if (bgImgStyle && bgImgStyle.indexOf("url(") < 0) {
            var newBgImgStyle = "url(" + CardsHelper.GetTreatablePath(bgImgStyle, stContainer, stCFolder) + ")";
            newBgImgStyle = encodeURI(newBgImgStyle);
            myStyle["background-image"] = newBgImgStyle;
        }
        return myStyle;
    };
    return CardsHelper;
}());
//# sourceMappingURL=MYCWeb.js.map