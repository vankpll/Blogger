/*! Custom - Theia Sticky Sidebar | v1.7.0 - https://github.com/WeCodePixels/theia-sticky-sidebar */
!function(i) {
    i.fn.theiaStickySidebar = function(t) {
        var e, o, a, s, n;

        function d(t, e) {
            if (t.initialized) return true;
            if (i("body").width() < t.minWidth) return false;

            // Initialize the sticky sidebar
            function initializeStickySidebar(t, e) {
                t.initialized = true;

                // Append styles to head
                if (i("#theia-sticky-sidebar-stylesheet-" + t.namespace).length === 0) {
                    i("head").append(i('<style id="theia-sticky-sidebar-stylesheet-' + t.namespace + '">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'));
                }

                e.each(function() {
                    var e = {
                        sidebar: i(this),
                        options: t || {},
                        container: i(t.containerSelector)
                    };
                    
                    if (e.container.length === 0) {
                        e.container = e.sidebar.parent();
                    }

                    e.sidebar.parents().css("-webkit-transform", "none");
                    e.sidebar.css({
                        position: t.defaultPosition,
                        overflow: "visible",
                        "-webkit-box-sizing": "border-box",
                        "-moz-box-sizing": "border-box",
                        "box-sizing": "border-box"
                    });

                    e.stickySidebar = e.sidebar.find(".theiaStickySidebar");

                    if (e.stickySidebar.length === 0) {
                        var o = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
                        e.sidebar.find("script").filter(function(i, t) {
                            return t.type.length === 0 || t.type.match(o);
                        }).remove();

                        e.stickySidebar = i("<div>").addClass("theiaStickySidebar").append(e.sidebar.children());
                        e.sidebar.append(e.stickySidebar);
                    }

                    e.marginBottom = parseInt(e.sidebar.css("margin-bottom"));
                    e.paddingTop = parseInt(e.sidebar.css("padding-top"));
                    e.paddingBottom = parseInt(e.sidebar.css("padding-bottom"));

                    var a, s, n, d = e.stickySidebar.offset().top,
                        c = e.stickySidebar.outerHeight();

                    function resetSidebar() {
                        e.fixedScrollTop = 0;
                        e.sidebar.css({"min-height": "1px"});
                        e.stickySidebar.css({position: "static", width: "", transform: "none"});
                    }

                    e.stickySidebar.css("padding-top", 1);
                    e.stickySidebar.css("padding-bottom", 1);
                    d -= e.stickySidebar.offset().top;
                    c = e.stickySidebar.outerHeight() - c - d;

                    e.stickySidebarPaddingTop = d === 0 ? 0 : 1;
                    e.stickySidebarPaddingBottom = c === 0 ? 0 : 1;
                    e.previousScrollTop = null;
                    e.fixedScrollTop = 0;

                    resetSidebar();

                    e.onScroll = function(e) {
                        if (e.stickySidebar.is(":visible")) {
                            if (i("body").width() < e.options.minWidth) {
                                resetSidebar();
                                return;
                            }

                            if (e.options.disableOnResponsiveLayouts && e.sidebar.outerWidth("none" == e.sidebar.css("float")) + 50 > e.container.width()) {
                                resetSidebar();
                                return;
                            }

                            var s = i(document).scrollTop(),
                                n = "static";

                            if (s >= e.sidebar.offset().top + (e.paddingTop - e.options.additionalMarginTop)) {
                                var d, c = e.paddingTop + t.additionalMarginTop,
                                    b = e.paddingBottom + e.marginBottom + t.additionalMarginBottom,
                                    l = e.sidebar.offset().top,
                                    h = e.sidebar.offset().top + (a = e.container, s = a.height(), a.children().each(function() {
                                        s = Math.max(s, i(this).height());
                                    }), s),
                                    f = 0 + t.additionalMarginTop;

                                d = e.stickySidebar.outerHeight() + c + b < i(window).height() ? f + e.stickySidebar.outerHeight() : i(window).height() - e.marginBottom - e.paddingBottom - t.additionalMarginBottom;

                                var g = l - s + e.paddingTop,
                                    S = h - s - e.paddingBottom - e.marginBottom,
                                    m = e.stickySidebar.offset().top - s,
                                    y = e.previousScrollTop - s;

                                if ("fixed" == e.stickySidebar.css("position") && "modern" == e.options.sidebarBehavior) {
                                    m += y;
                                }

                                if ("stick-to-top" == e.options.sidebarBehavior) {
                                    m = t.additionalMarginTop;
                                }

                                if ("stick-to-bottom" == e.options.sidebarBehavior) {
                                    m = d - e.stickySidebar.outerHeight();
                                }

                                m = y > 0 ? Math.min(m, f) : Math.max(m, d - e.stickySidebar.outerHeight());
                                m = Math.max(m, g);
                                m = Math.min(m, S - e.stickySidebar.outerHeight());

                                var u = e.container.height() == e.stickySidebar.outerHeight();
                                n = !u && m == f || !u && m == d - e.stickySidebar.outerHeight() ? "fixed" : s + m - e.sidebar.offset().top - e.paddingTop <= t.additionalMarginTop ? "static" : "absolute";
                            }

                            if ("fixed" == n) {
                                var k = i(document).scrollLeft();
                                e.stickySidebar.css({
                                    position: "fixed",
                                    width: r(e.stickySidebar) + "px",
                                    transform: "translateY(" + m + "px)",
                                    left: e.sidebar.offset().left + parseInt(e.sidebar.css("padding-left")) - k + "px",
                                    top: "0px"
                                });
                            } else if ("absolute" == n) {
                                var v = {};
                                if ("absolute" != e.stickySidebar.css("position")) {
                                    v.position = "absolute";
                                    v.transform = "translateY(" + (s + m - e.sidebar.offset().top - e.stickySidebarPaddingTop - e.stickySidebarPaddingBottom) + "px)";
                                    v.top = "0px";
                                }
                                v.width = r(e.stickySidebar) + "px";
                                v.left = "";
                                e.stickySidebar.css(v);
                            } else {
                                if ("static" == n) {
                                    resetSidebar();
                                }
                            }

                            if ("static" != n && 1 == e.options.updateSidebarHeight) {
                                e.sidebar.css({"min-height": e.stickySidebar.outerHeight() + e.stickySidebar.offset().top - e.sidebar.offset().top + e.paddingBottom});
                            }

                            e.previousScrollTop = s;
                        }
                    };

                    e.onScroll(e);

                    i(document).on("scroll." + e.options.namespace, function(a) {
                        return function() {
                            a.onScroll(a);
                        }
                    }(e));

                    i(window).on("resize." + e.options.namespace, function(s) {
                        return function() {
                            s.stickySidebar.css({position: "static"});
                            s.onScroll(s);
                        }
                    }(e));

                    if (typeof ResizeSensor !== "undefined") {
                        new ResizeSensor(e.stickySidebar[0], function(n) {
                            return function() {
                                n.onScroll(n);
                            }
                        }(e));
                    }
                });
            }

            return initializeStickySidebar(t, e), true;
        }

        function r(i) {
            var t;
            try {
                t = i[0].getBoundingClientRect().width;
            } catch (i) {}

            return void 0 === t && (t = i.width()), t;
        }

        return (t = i.extend({
            containerSelector: "",
            additionalMarginTop: 0,
            additionalMarginBottom: 0,
            updateSidebarHeight: true,
            minWidth: 0,
            disableOnResponsiveLayouts: true,
            sidebarBehavior: "modern",
            defaultPosition: "relative",
            namespace: "TSS"
        }, t)).additionalMarginTop = parseInt(t.additionalMarginTop) || 0, t.additionalMarginBottom = parseInt(t.additionalMarginBottom) || 0, d(e = t, this) || (console.log("TSS: Body width smaller than options.minWidth. Init is delayed."), i(document).on("scroll." + e.namespace, function(s) {
            return function(t) {
                d(s, n) && i(this).unbind(t);
            }
        }(e, this)), i(window).on("resize." + e.namespace, function(o) {
            return function(t) {
                d(o, a) && i(this).unbind(t);
            }
        }(e, this))), this;
    };
}(jQuery);
