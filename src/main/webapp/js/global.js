var $topMenu;
var $topMainMenu;
var $topSubMenu;
var $topMenuBg;
var menu_def = 0;
var fixed_menu = 0;

var visualLength = 0;
var currentVisualIndex = 0
var VISUAL_SHOW_DURATION = 1000;
var VISUAL_AUTO_PLAY_TIME = 5000;
var TEXT_SPEED = 700;

$(document).ready(function() {
    if (typeof(snum) != "undefined") {
        var mn = snum.substr(6, 1);
        var snum2 = snum.substr(0, 9);

        $topMenu = $("#hd_menu");
        $topMainMenu = $topMenu.find(".main_menu");
        $topSubMenu = $topMenu.find(".sub_menu");
        $topMenuBg = $(".hd_menu_bg");
        var $topMM = $topMainMenu.children("li");
        var $topSM = $topSubMenu.children("ul").children("li");
        var $currTMM = $topMainMenu.children("li.menu" + mn);
        var $currTSM = $topSubMenu.children("ul").children("li." + snum2);

        // 모바일 기기에서는 링크 이동 X.
        /*
        if (g5_is_mobile2 == "1") {
            $topMM.children("a").on("click", function(e) {
                e.preventDefault(); // a태그 링크 이동 막기
            });
        }
        */
        // 메뉴 현재 페이지
        currentMenu();

        // 모바일 메뉴
        $("#header").on("click", ".toggle_menu", function() {
            $("#hd_menu.mob_menu").slideToggle(function() {
                if ($(this).css("display") == "none") {
                    resetMenu();
                    $topSubMenu.hide();
                    currentMenu();
                    $(".toggle_menu").removeClass("close");
                } else {
                    $(".toggle_menu").addClass("close");
                }
            });

            if ($topMenu.hasClass("pc_menu")) {
                if ($topMenu.hasClass("fixed_menu")) {
                    fixed_menu = 0;
                    $(this).removeClass("close");
                    $topMenu.removeClass("fixed_menu");
                    $topMenu.trigger("mouseleave");
                } else {
                    fixed_menu = 1;
                    $topMenu.trigger("mouseenter");
                }
            }
        });

        $topMM.children("a").on("click", function(e) {
            if ($(this).closest("nav").hasClass("mob_menu")) {
                e.preventDefault(); // a태그 링크 이동 막기

                var element = $(this).parent("li");

                if (element.hasClass("open")) {
                    element.removeClass("open");
                    element.find(".sub_menu").slideUp();
                    $topMM.removeClass("on");
                    currentMenu();
                } else {
                    $topMM.siblings("li").children(".sub_menu").slideUp();
                    $topMM.siblings("li").removeClass("open").removeClass("on");
                    element.addClass("open").addClass("on");
                    element.children(".sub_menu").slideDown();
                }
            }
        });

        // PC 메뉴
        var menu_op = 0;
        var menu_top = 0;
        var menu_hei = 0;

        $topMenu.on("mouseenter", function() {
            if ($(this).hasClass("pc_menu")) {
                $topSubMenu.css("display", "block");
                $topMenuBg.css("display", "block");
                menu_top = 1;
            }
        }).on("mouseleave", function() {
            if ($(this).hasClass("pc_menu")) {
                menu_top = 0;
            }
        });		

        $topMenuBg.on("mouseenter", function() {
            menu_top = 1;
        }).on("mouseleave", function() {
            menu_top = 0;
        });

        function MenuMotion() {
            if (menu_op == menu_top || $topMenu.hasClass("mob_menu") || $topMenu.hasClass("fixed_menu")) {
                if (fixed_menu == 1) {
                    $(".toggle_menu").addClass("close");
                    $topMenu.addClass("fixed_menu");
                }

                return false;
            }

            var tarHei = menu_top==1 ? menu_def : 0;

            menu_op += ( menu_top - menu_op ) * .2;
            menu_hei += ( tarHei - menu_hei ) * .2;

            $topSubMenu.css("height", menu_hei);
            $topMenuBg.css("height", menu_hei);

            if (Math.abs(menu_top - menu_op) < 0.01) {
                menu_op = menu_top;
                menu_hei = tarHei;

                if (menu_op == 0) {
                    $topSubMenu.css("display", "none");
                    $topMenuBg.css("display", "none");
                    resetMenu();
                    currentMenu();
                }
            }
        }

        var timer = setInterval(MenuMotion, 30);

        function currentMenu() {
            $currTMM.addClass("on");
            $currTSM.addClass("on");
        }

        function resetMenu() {
            $topMM.removeClass("on");
            $topSM.removeClass("on");
        }

        // header 메인 메뉴
        $topMM.on("mouseenter", function() {
            if ($(this).closest("nav").hasClass("pc_menu")) {
                resetMenu();
                $(this).addClass("on");
                if ($(this).hasClass("menu" + mn)) $currTSM.addClass("on");
            }
        });

        // header 서브 메뉴
        $topSM.on("mouseenter", function() {
            if ($(this).closest("nav").hasClass("pc_menu")) {
                resetMenu();
                $(this).closest("div").parent("li").addClass("on");
                $(this).addClass("on");
            }
        });
        $topSubMenu.on("mouseleave", function() {
            $topSM.removeClass("on");
            if ($(this).closest("li").hasClass("menu" + mn)) $currTSM.addClass("on");
        });


        /* 공통 */
        responsive_menu();
        bgImgBugFix();
        initVisual();
        startVisualAutoPlay();
        Mnotice();
        if (snum == "menu_9999") {
            initVisualEventListener();
        } else {
            tabEvent(".tab_menu li", snum);

            // 유튜브 동영상 반응형으로 넣기
            $('iframe[src^="https://www.youtube.com/"]').wrap('<div class="youtube_wrap"></div>');

            if (snum = "menu_0402"){
                Mnotice();
            }
        }

        $(window).resize(function() {
            responsive_menu();
            bgImgBugFix();
        });
    }
});

$(window).load(function(){
    mobile_table_li();
});

// 모바일 li 높이 맞추기
function mobile_table_li()
{
    if($(window).width() < 1024)
    {
        $(".tbl_prog:visible > div").each(function(){
            var $titli = $(this).find(".prog_request_tit > li:last");
            var $conli = $(this).find(".prog_request_cont > li:last");
            var theight = $titli.outerHeight();
            var cheight = $conli.outerHeight();
            if(theight < cheight) $titli.css("height", cheight+"px");
            else $conli.css("height", theight+"Px");
        });

        $(".prog_container02 > div:visible").each(function(){
            var $progbox = $(this);

            $(this).find(".prog_request_tit > li").each(function(idx){
                var $titli = $(this);
                var $conli = $progbox.find(".prog_request_cont > li").eq(idx);
                var theight = $titli.outerHeight();
                var cheight = $conli.outerHeight();
                if(theight < cheight) $titli.css("height", cheight+"px");
                else $conli.css("height", theight+"Px");
            });
        });
    }
}

// 브라우저 background-image 100% 버그 (이미지 넓이를 짝수로 맞춘다)
function bgImgBugFix() {
    if ($(window).width() % 2) var vis_width = $(window).width() + 1;
    else var vis_width = $(window).width();

    $(".bg_vis li").css("width", vis_width);
}

/* 공통 */
function responsive_menu() {
    var winWidth = window.innerWidth;
    var minWidthPc = 1200; // 1024;
    $topSubMenu.each(function() {
        var menu_height = $(this).outerHeight();

        if (menu_def < menu_height) {
            menu_def = menu_height;
        }
    });

    if (winWidth >= minWidthPc) {
        $("#hd_menu").removeClass("mob_menu").addClass("pc_menu");
        $topMenuBg.children("div").css("height", menu_def);
    } else {
        $("#hd_menu").addClass("mob_menu").removeClass("pc_menu");
        $topMenuBg.children("div").css("height", "");
    }
    $topMenuBg.hide();
    $("#hd_menu").removeAttr("style").removeClass("fixed_menu");
    $("#hd_menu .sub_menu").removeAttr("style");
    $(".toggle_menu").removeClass("close");

    fixed_menu = 0;
}

/* 공통 */
// 비주얼
function initVisual() {
    visualAutoTimerID = 0;
    $visual_img = $(".bg_vis li");
    visualLength = $visual_img.length;
    $visual_img.eq(0).fadeIn(VISUAL_SHOW_DURATION);
    if (snum == "menu_9999") {
        $visual_dot = $(".dot_vis li");
        showVisualDotAt(0);
        // MVtextFO1();
    } else {
        // SVtextFO1();
    }
}

function initVisualEventListener() {
    $visual_dot.hover(function() {
        stopVisualAutoPlay();
        var visualIndex = $visual_dot.index(this);
        showVisualAt(visualIndex);
    }, function() {
        startVisualAutoPlay();
    });

    $(".btn_vis > div").hover(function() {
        stopVisualAutoPlay();
    }, function() {
        startVisualAutoPlay();
    });

    $(".visual").on("click", ".btn_prev", function() {
        if (!$visual_img.is(':animated')) {
            prevVisual();
        }
    });
    $(".visual").on("click", ".btn_next", function() {
        if (!$visual_img.is(':animated')) {
            nextVisual();
        }
    });
}


function prevVisual() {
    var visualIndex = currentVisualIndex - 1;
    if (visualIndex < 0)
        visualIndex = visualLength - 1;
    this.showVisualAt(visualIndex);
}

function nextVisual() {
    var visualIndex = currentVisualIndex + 1;
    if (visualIndex >= visualLength)
        visualIndex = 0;
    this.showVisualAt(visualIndex);
}

function showVisualDotAt(visualIndex) {
    this.$visual_dot.eq(this.currentVisualIndex).removeClass("selected");
    this.$visual_dot.eq(visualIndex).addClass("selected");
}

function showVisualAt(visualIndex) {
    if (visualIndex != this.currentVisualIndex) {
        if (snum == "menu_9999") {
            showVisualDotAt(visualIndex);
            // MVtextFO1();
        } else {
            // SVtextFO1();
        }
        $visual_img.eq(currentVisualIndex).fadeOut(VISUAL_SHOW_DURATION, function() { });
        $visual_img.eq(visualIndex).fadeIn(VISUAL_SHOW_DURATION, function() { });
        this.currentVisualIndex = visualIndex;
    }
}

function startVisualAutoPlay() {
    if (this.visualAutoTimerID != 0)
        clearInterval(this.visualAutoTimerID);
    this.visualAutoTimerID = setInterval(function() { nextVisual(); }, this.VISUAL_AUTO_PLAY_TIME);
}

function stopVisualAutoPlay() {
    if (this.visualAutoTimerID != 0)
        clearInterval(this.visualAutoTimerID);
    this.visualAutoTimerID = 0;
}


/* 메인 */
// 비주얼 텍스트
function MVtextFI1() {
    $(".txt_vis .mvis_txt01").delay(300).animate({opacity:"show", left:"6%"}, TEXT_SPEED, "linear");
    $(".txt_vis .mvis_txt02").delay(700).animate({opacity:"show", top:"65px"}, TEXT_SPEED, "swing", function() {
        setTimeout(function() { MVtextFO1(); }, 4000);
    });
}

function MVtextFO1() {
    $(".txt_vis .mvis_txt01").delay(0).animate({opacity:"hide", left:"6%"}, TEXT_SPEED, "linear", function() {
        $(".txt_vis .mvis_txt01").css("left", "9%");
    });
    $(".txt_vis .mvis_txt02").delay(0).animate({opacity:"hide", top:"65px"}, TEXT_SPEED, "swing", function() {
        $(".txt_vis .mvis_txt02").css("top", "95px");
        setTimeout(function() { MVtextFI1(); }, 0);
    });
}


/* 서브 */
// 비주얼 텍스트
function SVtextFI1() {
    $(".txt_vis .svis_txt01").delay(300).animate({opacity:"show", left:"5%"}, TEXT_SPEED, "linear");
    $(".txt_vis .svis_txt02").delay(650).animate({opacity:"show", top:"65px"}, TEXT_SPEED, "swing", function() {
        setTimeout(function() { SVtextFO1(); }, 4000);
    });
}

function SVtextFO1() {
    $(".txt_vis .svis_txt01").delay(0).animate({opacity:"hide", left:"5%"}, TEXT_SPEED, "linear", function() {
        $(".txt_vis .svis_txt01").css("left", "8%");
    });
    $(".txt_vis .svis_txt02").delay(0).animate({opacity:"hide", top:"65px"}, TEXT_SPEED, "swing", function() {
        $(".txt_vis .svis_txt02").css("top", "95px");
        setTimeout(function() { SVtextFI1(); }, 0);
    });
}


// 공지사항
function Mnotice(){
    $('.boarda .boarda_btn li').each(function(){
        $(this).click(function(){
            var tabno = $('.boarda .boarda_btn li').index(this) + 1;
            var tcon = 	'.tc' + tabno;
            $('.boarda .n_con').removeClass('tabsel');
            $(tcon).addClass('tabsel');
            $('.boarda_btn li').removeClass('selected');
            $(this).addClass('selected');
        });
    });
}

// 탭
function tabEvent(tabPath, tabNum) {
    $(tabPath + "." + tabNum).addClass("selected");

    $(tabPath).hover(function() {
        $(tabPath).removeClass("selected");
        $(this).addClass("selected");
    }, function() {
        $(tabPath).removeClass("selected");
        $(tabPath + "." + tabNum).addClass("selected");
    });
}