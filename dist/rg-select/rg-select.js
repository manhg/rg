riot.tag("rg-select", '<input type="{opts.select.filter ? \'search\' : \'text\'}"'+
                 ' ref="selectfield" class="c-field" placeholder="{opts.select.placeholder}"'+
                 ' onkeydown="{navigate}" oninput="{filterOptions}" onfocus="{open}" __readonly="{!opts.select.filter}">'+
   ' <ul class="c-card c-card--menu u-high" if="{opts.select.isvisible}">'+
     ' <li each="{options}" no-reorder onclick="{parent.select}" class="c-card__item {\'c-card__item--active\': selected,'+
      ' \'c-card__item--disabled\': disabled, \'c-card--menu__item--hover\': active}"> {text}'+
      ' </li>'+
    ' </ul>',
    'rg-select .c-card--menu,[riot-tag="rg-select"] .c-card--menu,[data-is="rg-select"] .c-card--menu{ position: relative; }', "",
function(opts) {
    var _this = this;

    if (!opts.select) opts.select = {
        options: []
    };

    var handleClickOutside = function handleClickOutside(e) {
        if (!_this.root.contains(e.target)) _this.close();
        _this.update()
    };


    var applyFieldText = function applyFieldText() {
        for (var i = 0; i < opts.select.options.length; i++) {
            var item = opts.select.options[i];
            if (item.selected) {
                _this.refs.selectfield.value = item.text;
                break
            }
        }
    };

    this.filterOptions = function() {
        _this.options = opts.select.options;
        if (opts.select.filter) _this.options = _this.options.filter(function(option) {
            var attr = option[opts.select.filter];
            return attr && attr.toLowerCase().indexOf(_this.refs.selectfield.value.toLowerCase()) > -1
        });
        _this.trigger("filter", _this.refs.selectfield.value)
    };

    function getWindowDimensions() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName("body")[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return {
            width: x,
            height: y
        }
    } ;

    var positionDropdown = function positionDropdown() {
        var w = getWindowDimensions();
        var m = _this.root.querySelector(".c-card--menu");
        if (!m) return;
        if (!opts.select.isvisible) {
            m.style.marginTop = "";
            m.style.marginLeft = "";
            return
        } ;

        var pos = m.getBoundingClientRect();

        if (w.width < pos.left + pos.width) {
            m.style.marginLeft = w.width - (pos.left + pos.width) - 20 + "px"
        }

        if (pos.left < 0) {
            m.style.marginLeft = "20px"
        }
        if (w.height < pos.top + pos.height) {
            m.style.marginTop = w.height - (pos.top + pos.height) - 20 + "px"
        }
    };


    this.navigate = function(e) {
        if ([13, 38, 40].indexOf(e.keyCode) > -1 && !opts.select.isvisible) {
            e.preventDefault();
            _this.open();
            return true
        }

        var length = _this.options.length;

        if (length > 0 && [13, 38, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            var activeIndex = null;
            for (var i = 0; i < length; i++) {
                var item = _this.options[i];
                if (item.active) {
                    activeIndex = i;
                    break
                }
            }
            if (activeIndex != null) _this.options[activeIndex].active = false;
            if (e.keyCode == 38) {
                if (activeIndex == null || activeIndex == 0) _this.options[length - 1].active = true;
                else _this.options[activeIndex - 1].active = true
            } else if (e.keyCode == 40) {
                if (activeIndex == null || activeIndex == length - 1) _this.options[0].active = true;
                else _this.options[activeIndex + 1].active = true;
            } else if (e.keyCode == 13 && activeIndex != null) {
                _this.select({
                    item: _this.options[activeIndex]
                })
            }
        }
        return true
    };
