function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

;(function($) {
  (function(pluginName) {
    var defaults = {
      keypadDiv: '#keypad_inner',
      keypadPlaceholderDiv: '#keypad_placeholder',
      height: 460,
      buttonTemplate: '<button></button>',
      deleteButtonText: 'del',
      deleteButtonClass: 'delete',
      showDecimal: false,
      showIncDec: false,
      inputCssClass: ""
    };

    $.fn[pluginName] = function(options) {
      options = $.extend(true, {}, defaults, options);

      keypadVisible = false;

      function hideKeyPadIfRequired(e) {
        if (!$(event.target).parent().hasClass("keypad") && 
            !$(event.target).hasClass("keypad")) { 
          $("#keypad").hide();
          $(".typed-cursor").hide();
          $("#keypad_placeholder").hide();        
          keypadVisible = false;
        }
      }

      $("body").append("<div id='keypad' class='keypad'><div id='keypad_inner' class='keypad'></div></div><div id='keypad_placeholder'></div>");

      var   $elem = jQuery.type(options.keypadDiv) == 'string' ? $(options.keypadDiv) : options.keypadDiv,
            $elem_placeholder = jQuery.type(options.keypadPlaceholderDiv) == 'string' ? $(options.keypadPlaceholderDiv) : options.keypadPlaceholderDiv;


        var numbers = Array.apply(null, Array(9)).map(function (_, i) {
          return $(options.buttonTemplate).html(i+1).addClass('number');
        });
        numbers.push($(options.buttonTemplate).html(options.deleteButtonText).addClass(options.deleteButtonClass));
        numbers.push($(options.buttonTemplate).html("0").addClass('number').addClass('zero'));
        numbers.push($(options.buttonTemplate).html(".").addClass('number').addClass("decimal"));
        numbers.push($(options.buttonTemplate).html("+").addClass('inc'));
        numbers.push($(options.buttonTemplate).html("-").addClass('dec'));
        $elem.html(numbers).addClass('keypad');


      function rebuildKeypad() {

        if (options.showIncDec) {
          $('.number, .dec, .inc, .' + options.deleteButtonClass).css("height",  "18%");
          $(".dec, .inc").show();
        }
        else {
          $(".dec, .inc").hide();
        }
        if (options.showDecimal) {
          $(".zero").css("width", "31%");
          $(".decimal").show();
        }
        else {
          $(".zero").css("width", "64%");
          $(".decimal").hide();
        }

      }  

      $(document).on('touchend click', function(e) {
          hideKeyPadIfRequired(e);
          moveEvent = false;
      });
      $(document).on('touchmove', function(e) {
          if (keypadVisible)  { 
            hideKeyPadIfRequired(e);
          }
          moveEvent = true;
      });

            
      return this.each(function() {

        var input = this,
          $input = $(input);


        if ('ontouchstart' in document.documentElement) {
          $input.after("<span class='keypad numinput " + options.inputCssClass + 
            "' id='keypad" + 
            input.id +
            "'><span class='before_cursor'></span><span class='typed-cursor blinking'>|</span></span>");
          $input.hide();
        }

        $fake_input = $("#keypad" + input.id);

        $fake_input.on('touchstart', function(e) {
            event.stopPropagation();
            event.preventDefault();
            if(event.handled !== true) {          
              keypadVisible = true;
              $(".typed-cursor").hide();
              $(e.target).find(".typed-cursor").show();
              rebuildKeypad();
              $elem_placeholder.show();
              $("#keypad").slideDown();

              screen_height = $(window).height() / 2 > 250 ? $(window).height() / 2 : 250;

              $("html, body").animate({ scrollTop: findPos(e.target) - 
                (screen_height - $(e.target).height() - 20)}, 600);

              $global_input = $('#' + e.target.id.substring(6));

            }
            else {
              return false;
            }
        });

        $fake_input.on('click', function(e) {
          setTimeout(function() {
            if (!keypadVisible) {
              $input.show();
              $('#keypad' + input.id).hide();
              $input.focus();
            }
          }, 300);
        });

        $input.on('blur', function(e) {
          $input.hide();
          $('#keypad' + input.id).show();
        })

        $input.on('change', function(e) {
          $('#keypad' + input.id).find("span.before_cursor").html($input.val());
        });

        $elem.find('.number').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {          
            $global_input.val($global_input.val() + $(e.target).text());
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

        $elem.find('.' + options.deleteButtonClass).on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {          
            $global_input.val($global_input.val().slice(0, -1));
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

        $elem.find('.inc').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {   
            $global_input.val( function(i, oldval) {
                 return ++oldval;
            });       
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

        $elem.find('.dec').on('touchend click', function(e) {
          event.stopPropagation();
          event.preventDefault();
          if(event.handled !== true) {   
            $global_input.val( function(i, oldval) {
                 return --oldval;
            });       
            $global_input.trigger('change');
            event.handled = true;
          }
          else {
            return false;
          }
        });

      });
    };
    $.fn[pluginName].defaults = defaults;
  })('keypad');
})(jQuery);