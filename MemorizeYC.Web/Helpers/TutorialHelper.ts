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
enum AudioSequenceStateEnum {
    End, Pause, Playing
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
        PlayOneCategoryPageController.Current.TutorType =TutorMainEnum[TutorMainEnum.End];
    }

    public static Action(state: TutorState) {
        $(GlobalVariables.gdTutorElements.btHide).off('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btHide).on('click', TutorialHelper.onBtHide);
        $(GlobalVariables.gdTutorElements.btStop).off('click', TutorialHelper.onBtStop);
        $(GlobalVariables.gdTutorElements.btStop).on('click', TutorialHelper.onBtStop);

        if (!GlobalVariables.PageTexts)
            GlobalVariables.PageTexts = PageTextHelper.defaultPageTexts;
        var thisPageTexts = GlobalVariables.PageTexts.PlayOneCategoryPageJSON;

        switch (state.Main) {
            case TutorMainEnum.Begin:
                //#region Begin
                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html(
                    "<div style='text-align:center; font-size:6vw;'>" +
                    thisPageTexts.stTutor +
                    "</div>" +
                    "<div style='text-align:center; font-size:3vh;'>" +
                    thisPageTexts.stTut0_1_1 +
                    "<br/>" +
                    thisPageTexts.stTut0_1_2.replace(/\{0\}/g, (st) => {
                        return "<span class='glyphicon glyphicon-menu-hamburger' > </span>";
                    }) +"<br/>"+
                    thisPageTexts.stTut0_1_3.replace(/\{0\}/g, (st) => {
                        return "<span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub>";
                    }) +
                        "</div>"
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
                    alert(thisPageTexts.stTut0To1);
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
                            "<div style='text-align:center; font-size:5vh;'>" +
                            thisPageTexts.stTut1_1 +
                            "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" +
                            thisPageTexts.stTut1_1_1.replace('{0}', "<span class='glyphicon glyphicon-plus' style='color:red; font-size:4vw;'></span>").replace('{1}',"<span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span>") +"</div>"
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
                                alert(thisPageTexts.stTut1_1To2);
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
                            "<div style='text-align:center; font-size:5vh;'>" +
                            thisPageTexts.stTut1_2 +
                            "</div>"+
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_2_1
                                .replace('{0}', "<span class='glyphicon glyphicon-minus' style='color:red; font-size:4vw;'></span>")
                                .replace('{1}', "<span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span>")
                            + "</div>"
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

                                alert(thisPageTexts.stTut1_2To3);
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
                            "<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut1_3
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_3_0.replace('{0}', "<span class='glyphicon glyphicon-play' style='color:red;'></span>")
                                .replace('{1}',"<span class='glyphicon glyphicon-step-forward' style='color:red;'></span>")
                            +"</div>"
                        );
                        //* [2016-07-06 10:01] Blink the buttons
                        $(".glyphicon-play").addClass('blink');
                        $(".glyphicon-step-forward").addClass('blink');

                        //* [2016-07-06 10:01] After Clicking them, you need to show it again
                        var onPlay = (ev) => {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>" +thisPageTexts.stTut1_3_1
                                +"</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_3_1_1.replace('{0}',"<span class='glyphicon glyphicon-resize-small'></span>")
                                +"</div>"
                            );
                            $("#gdTutorial #btHide").addClass('blink');
                            $("#btSynPlay,#btSynNext").off('click', onPlay);
                            //* [2016-07-06 10:01] stop blinking the buttons
                            $(".glyphicon-play").removeClass('blink');
                            $(".glyphicon-step-forward").removeClass('blink');

                            //* [2016-07-06 11:16] 
                            var onRemove = (ev) => {
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                alert(thisPageTexts.stTut1_3To4);
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
                            "<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut1_4_Title
                            + "</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            thisPageTexts.stTut1_4_Content.replace('{0}', "<span class='glyphicon glyphicon-refresh'></span>")
                                .replace('{1}',"<img src='http://memorizeyc.azurewebsites.net/Static/PlayPage/SpeechLang.png' alt='Choose a Language' style='width:32px'/>")
                            + "</div>"
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
                                "<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut1_4_1_Title
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut1_4_1_Content.replace('{0}', "<span class='glyphicon glyphicon-play'></span>")
                                +"</div>"
                            );
                            $('.glyphicon-play').addClass('blink');
                            var onPlay = (ev) => {
                                $('.glyphicon-play').off('click', onPlay);
                                $('.glyphicon-play').removeClass('blink');
                                $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                                alert(thisPageTexts.stTut1_4To5);
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
                            "<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut1_5_Title
                            +"</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            thisPageTexts.stTut1_5_Content.replace(/\{0\}/g, PlayOneCategoryPageController.Current.numWCardShown.toString())
                                .replace('{1}', "<button>Rest:<br /><span class='badge'>" + PlayOneCategoryPageController.Current.numRestWCards +"</span></button>")
                                .replace('{2}', "<span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:3vh;'></span><br/>")+
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
                                alert(thisPageTexts.stTut1_5To6);
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
                            "<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut1_6_Title
                            +"</div>" +
                            "<div style='text-align:left; font-size:2vh;'>" +
                            thisPageTexts.stTut1_6_Content.replace('{0}', "<span class='glyphicon glyphicon-resize-small'></span>")
                                .replace('{1}',"<img src='http://files.channel9.msdn.com/thumbnail/5b5394ca-30b2-4880-99fb-89de81c8e46b.jpg' style='width:3vh'/>X2")
                             +" </div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $(GlobalVariables.gdTutorElements.btHide).addClass('blink');

                        var onShownInfo = (ev) => {
                            alert(thisPageTexts.stTut1_6To7);
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
                        //#region Hint -> Show one card's hint
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:5vh;'>" +thisPageTexts.stTut2_0_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut2_0_Content.replace('{0}', "<input type='radio'/>")
                                .replace('{1}',"<span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span>")
                            +"</div>"
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
                                "<div style='text-align:center; font-size:5vh;'>" +thisPageTexts.stTut2_1_Title
                                + "</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" +
                                thisPageTexts.stTut2_1_Content.replace('{0}', "<span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub>")
                                +"</div>"
                            );
                            $(PlayOneCategoryPageController.Current.ddSettings).off(GlobalVariables.PlayTypeChangeKey, onChange);
                            $(GlobalVariables.gdTutorElements.btHide).addClass('blink');
                            //* [2016-07-07 13:15] Now show another tutorial when any one card is clicked.
                            var onCardClicked = (ev) => {
                                alert(thisPageTexts.stTut2_1To2);
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
                        //#endregion Hint -> Show one card's hint
                        break;
                    case 1:
                        //#region Hint - Show all cards' information in succession
                        $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                        $(GlobalVariables.gdTutorElements.gdContent).html(
                            "<div style='text-align:center; font-size:4vh;'>" + thisPageTexts.stTut2_2_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:2vh;'>" + thisPageTexts.stTut2_2_Content.replace('{0}', "<button class='glyphicon glyphicon-exclamation-sign'/>")
                                .replace('{1}', "<button class='glyphicon glyphicon-pause'/>")
                            + "</div>"
                        );
                        //* [2016-07-06 09:53] Blink the buttons
                        $("button.glyphicon-pause,button.glyphicon-exclamation-sign").addClass('blink');
                        var onClickPlayAll = (ev) => {
                            $(GlobalVariables.gdTutorElements.gdMain).hide('slow');
                            $(PlayOneCategoryPageController.Current.btAudioAllPlay).off('click', onClickPlayAll);
                        }
                        $(PlayOneCategoryPageController.Current.btAudioAllPlay).off('click', onClickPlayAll);
                        $(PlayOneCategoryPageController.Current.btAudioAllPlay).on('click', onClickPlayAll);

                        var onAudioStop = (ev,audioState:AudioSequenceStateEnum) => {
                            $(PlayOneCategoryPageController.Current.btPauseAudio).off(GlobalVariables.AudioPauseKey, onAudioStop);
                            $("button.glyphicon-pause,button.glyphicon-exclamation-sign").removeClass('blink');
                            
                            if (audioState === AudioSequenceStateEnum.End || audioState === AudioSequenceStateEnum.Pause)
                                alert(thisPageTexts.stTut2_2To3);
                            if (GlobalVariables.isTutorMode) {
                                GlobalVariables.tutorState.Step++;
                                TutorialHelper.Action(GlobalVariables.tutorState);
                            }
                        };
                        $(PlayOneCategoryPageController.Current.btPauseAudio).off(GlobalVariables.AudioPauseKey, onAudioStop);
                        $(PlayOneCategoryPageController.Current.btPauseAudio).on(GlobalVariables.AudioPauseKey, onAudioStop);
                        //#endregion Hint - Show all cards' hint in succession
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
                            "<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut3_0_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_0_Content.replace('{0}', "<input type='radio'/>")
                                .replace('{1}',"<span class='glyphicon glyphicon-menu-hamburger' style='color:red; font-size:4vw;'></span>")
                            +"</div>"
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
                                "<div style='text-align:center; font-size:5vh;'>" +thisPageTexts.stTut3_1_Title
                                +"</div>" +
                                "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_1_Content.replace('{0}',"<span class='glyphicon glyphicon-resize-small'></span><sub>Hide</sub>")
                                +"</div>"
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
                            "<div style='text-align:center; font-size:5vh;'>" +thisPageTexts.stTut3_1_2_Title
                            + "</div>" +
                            "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut3_1_2_Content.replace('{0}',"CORRECT ANSWER")
                            +"</div>"
                        );
                        setTimeout(() => {
                            $(GlobalVariables.gdTutorElements.gdContent).html(
                                "<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut3_1_2_Title
                                +"</div>" +
                                "<div style='text-align:center; font-size:3vh;'>"+thisPageTexts.stTut3_1_2_Content.replace('{0}',                             PlayOneCategoryPageController.Current.selWCard.cardInfo.Dictate)
                                + "</div>"
                            );
                        }, 1000);

                        $("#tbKeyIn").addClass('blink-background');
                        //* [2016-07-06 11:16] If the answer is right, this event will be triggered
                        var onRemove = (ev) => {
                            $(GlobalVariables.gdTutorElements.gdMain).hide(0);
                            alert(thisPageTexts.stTut3_1To2);
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
                if (typeof (Storage) !== "undefined")
                    localStorage.setItem(GlobalVariables.IsShownTutorKey, String(GlobalVariables.isTutorMode));

                $(GlobalVariables.gdTutorElements.gdMain).show('slow');
                $(GlobalVariables.gdTutorElements.gdContent).html(
                    "<div style='text-align:center; font-size:5vh;'>" + thisPageTexts.stTut_End_Title
                    + "</div>" +
                    "<div style='text-align:center; font-size:3vh;'>" + thisPageTexts.stTut_End_Content.replace('{0}',"<span class='glyphicon glyphicon-remove-sign'></span><sub>Stop</sub>")
                    +"</div>"
                );
                PlayOneCategoryPageController.scope.$apply(() => { PlayOneCategoryPageController.Current.playType = PlayTypeEnum.syn; });
                break;
        }
    }
}