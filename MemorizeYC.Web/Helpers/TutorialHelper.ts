interface TutorialElements {
    gdMain: HTMLDivElement;
    gdBoard: HTMLDivElement;
    gdContent: HTMLDivElement;
    btHide: HTMLButtonElement;
    btStop: HTMLButtonElement;
};

enum TutorMainEnum {
    Begin,
    Basic,
    Hint,
    KeyIn,
    End
};

interface TutorState {
    Main: TutorMainEnum,
    Step: number
}

class TutorialHelper {

    public static onBtHide(ev) {
        $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
    }

    public static onBtStop(ev) {
        $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
        GlobalVariables.isTutorMode = false;
    }

    public static Action(state: TutorState) {
        $(GlobalVariables.gdTutorElements.btHide).off('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btHide).on('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btStop).off('click', TutorialHelper.onBtStop);
        $(GlobalVariables.gdTutorElements.btStop).on('click', TutorialHelper.onBtStop);

        switch (state.Main) {
            case TutorMainEnum.Begin:
                //#region Begin
                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html(
                    "<div style='text-align:center; font-size:6vw;'>Tutorial</div>" +
                    "<div style='text-align:center; font-size:3vh;'>You are in tutorial mode.<br/>" +
                        "Choose the <b>Basic</b> in <span class='glyphicon glyphicon-menu-hamburger'></span> to start this tutorial.<br/>" +
                        "Or click <span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub> to stop it. </div>"
                );
                //* [2016-07-06 09:53] Blink the buttons
                $(".glyphicon-menu-hamburger").addClass('blink');
                $(".glyphicon-remove-sign").addClass('blink');
                $(PlayOneCategoryPageController.Current.rdTutorType).addClass('blink');
                var onStateChange = (ev) => {
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
                //#endregion Begin
                break;
            case TutorMainEnum.Basic:
                switch (state.Step) {
                    case 0:
                        //#region Basic->enlarge
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>1.1 Basic - Enlarge Cards</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-plus' style='color:red; font-size:4vw;'></span> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to enlarge all cards.</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $(".glyphicon-plus").addClass('blink');

                        $("#ddSettings .glyphicon-plus").one('click', (ev) => {
                            setTimeout(() => {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                //* [2016-07-06 09:53] Blink the buttons
                                $(".glyphicon-menu-hamburger").removeClass('blink');
                                $(".glyphicon-plus").removeClass('blink');
                                alert("Hooray!\nYou did it!");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            },500);
                        });
                        //#endregion Basic->enlarge
                        break;
                    case 1:
                        //#region Basic->shrink
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>1.2 Basic - Shrink Cards</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-minus' style='color:red; font-size:4vw;'></span> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to shrink all cards.</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $(".glyphicon-minus").addClass('blink');

                        $("#ddSettings .glyphicon-minus").one('click', (ev) => {
                            setTimeout(() => {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                //* [2016-07-06 09:53] Blink the buttons
                                $(".glyphicon-menu-hamburger").removeClass('blink');
                                $(".glyphicon-minus").removeClass('blink');

                                alert("Great Job!");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        //#endregion Basic->shrink
                        break;
                    case 2:
                        //#region Basic->Pair
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>1.3 Basic - Pair</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-play' style='color:red;'></span><sub>Play</sub> or <span class='glyphicon glyphicon-step-forward' style='color:red;'></span><sub>Next</sub> at first.</div>"
                        );
                        //* [2016-07-06 10:01] Blink the buttons
                        $(".glyphicon-play").addClass('blink');
                        $(".glyphicon-step-forward").addClass('blink');

                        //* [2016-07-06 10:01] After Clicking them, you need to show it again
                        var onPlay = (ev) => {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>1.3.1 Pair - Tap Correct Card</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub> to hide this tutorial and tap a coorect card to annihilate it. </div>"
                            );
                            $("#gdTutorial #btHide").addClass('blink');
                            $("#btSynPlay,#btSynNext").off('click', onPlay);
                            //* [2016-07-06 10:01] stop blinking the buttons
                            $(".glyphicon-play").removeClass('blink');
                            $(".glyphicon-step-forward").removeClass('blink');

                            //* [2016-07-06 11:16] 
                            var onRemove = (ev) => {
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
                        //#endregion Basic->Pair
                    case 3:
                        if (!GlobalVariables.allVoices || GlobalVariables.allVoices.length === 0) {
                            GlobalVariables.tutorState.Step++;
                            TutorialHelper.Action(GlobalVariables.tutorState);
                            break;
                        };
                        //#region Basic->Choose SynLang
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>1.4 Basic - Change Speech Synthesizer's Voice</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Choose a Language beside the <span class='glyphicon glyphicon-refresh'></span> button in <img src='http://memorizeyc.azurewebsites.net/Static/PlayPage/SpeechLang.png' alt='Choose a Language' style='width:32px'/>.</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $("#dropdownLangSettings").addClass('blink');
                        $("#cbSynAllVoices").addClass('blink');

                        //* [2016-07-06 14:21] When SynLang is changed, it will be launched.
                        var onChange = (ev) => {
                            $(PlayOneCategoryPageController.Current.btLangSettings).off(GlobalVariables.SynVoiceChangeKey, onChange);
                            $("#dropdownLangSettings").removeClass('blink');
                            $("#cbSynAllVoices").removeClass('blink');
                            $("#dpLangMain").removeClass('open');

                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>1.4.1 Basic - Voice is Changed</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-play'></span> will play the sentence with different voice.</div>"
                            );
                            $('.glyphicon-play').addClass('blink');
                            var onPlay = (ev) => {
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

                        //#endregion Basic->Choose SynLang
                        break;
                    case 4:
                        //#region Basic-> Change Cards
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:4vh;'>1.5 Basic - Change Cards</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            "  Because total number of cards might be larger than '"+ PlayOneCategoryPageController.Current.numWCardShown+"',"+
                            "Click <button>Rest:<br /><span class='badge'>"+ PlayOneCategoryPageController.Current.numRestWCards+"</span></button> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:3vh;'></span> to change cards.<br/>" +
                            "By the way, the number '"+PlayOneCategoryPageController.Current.numWCardShown+"' can be set by yourself."+
                            "</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $("#btChangeCards").addClass('blink');

                        $("#btChangeCards").one('click', (ev) => {
                            setTimeout(() => {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                $('#dpPlaySettings').removeClass('open');
                                //* [2016-07-06 09:53] Blink the buttons
                                $(".glyphicon-menu-hamburger").removeClass('blink');
                                $("#btChangeCards").removeClass('blink');
                                alert("Now you know how to change cards!");
                                if (GlobalVariables.isTutorMode) {
                                    GlobalVariables.tutorState.Step++;
                                    TutorialHelper.Action(GlobalVariables.tutorState);
                                }
                            }, 500);
                        });
                        //#endregion Basic->enlarge
                        break;
                    case 5:
                        //#region Basic->information
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:4vh;'>1.6 Basic - Extra info for each Card</div>" +
                            "<div style='text-align:left; font-size:2vh;'> Hide me at first by clicking <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub>.<br/>" +
                            "Then, Double click (<img src='http://files.channel9.msdn.com/thumbnail/5b5394ca-30b2-4880-99fb-89de81c8e46b.jpg' style='width:3vh'/>X2) any Card will show you a popup for extra info.<br/>" +
                            " </div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(GlobalVariables.gdTutorElements.btHide).addClass('blink');

                        var onShownInfo = (ev) => {
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
                        //#endregion Basic->information
                        break;
                    default:
                        if (GlobalVariables.isTutorMode) {
                            GlobalVariables.tutorState = {Main: TutorMainEnum.Hint, Step:0};
                            TutorialHelper.Action(GlobalVariables.tutorState);
                        }
                        break;
                };
                break;
            case TutorMainEnum.Hint:
                switch (state.Step) {
                    case 0:
                        //#region Hint
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>2. Hint: Get cards' infomation</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <input type='radio'/><sub>Hint</sub> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to use Hint mode.</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $("#lbHint").addClass('blink');

                        var onChange = (ev) => {
                            if (PlayOneCategoryPageController.Current.playType != 'hint') return;
                            $(".glyphicon-menu-hamburger").removeClass('blink');
                            $("#lbHint").removeClass('blink');
                            $('#dpPlaySettings').removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>2.1 Hint: Click one card</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub> at first, then click at any one Card.</div>"
                            );
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            //* [2016-07-07 13:15] Now show another tutorial when any one card is clicked.
                            var onCardClicked = (ev) => {
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
                        //#endregion Hint
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
                        //#region KeyIn
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>3. KeyIn: Annihilate a Card by Input Correct Answer</div>" +
                            "<div style='text-align:center; font-size:3vh;'>Click <input type='radio'/><sub>KeyIn</sub> in <span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span> to use Hint mode.</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(".glyphicon-menu-hamburger").addClass('blink');
                        $("#lbKeyIn").addClass('blink');

                        var onChange = (ev) => {
                            if (PlayOneCategoryPageController.Current.playType != 'rec') return;
                            $(".glyphicon-menu-hamburger").removeClass('blink');
                            $("#lbKeyIn").removeClass('blink');
                            $('#dpPlaySettings').removeClass('open');
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>3.1 KeyIn: Click one card</div>" +
                                "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub> at first, then click at any one Card.</div>"
                            );
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            //* [2016-07-07 13:15] Now show another tutorial when any one card is clicked.
                            var onCardClicked = (ev) => {
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
                        //#endregion KeyIn
                        break;
                    case 1:
                        //#region KeyIn right answer
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>3.2 KeyIn: Key in Correct Answer</div>" +
                            "<div style='text-align:center; font-size:3vh;'> Key in CORRECT ANSWER into the textBox </div>"
                        );
                        setTimeout(() => {
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>3.2 KeyIn: Key in Correct Answer</div>" +
                                "<div style='text-align:center; font-size:3vh;'> Key in <b>" +
                                PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate
                                + "</b> into the textBox.</div>"
                            );
                        }, 1000);

                        $("#tbKeyIn").addClass('blink-background');
                        //* [2016-07-06 11:16] If the answer is right, this event will be triggered
                        var onRemove = (ev) => {
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


                        //#endregion KeyIn right answer                        
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
                $(GlobalVariables.gdTutorElements.gdContent).html(
                    "<div style='text-align:center; font-size:5vh;'>Well Done!</div>" +
                    "<div style='text-align:center; font-size:3vh;'>Click <span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub> to stop this tutorial.</div>"
                );
                PlayOneCategoryPageController.scope.$apply(() => { PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn; });
                break;
        }
    }
}