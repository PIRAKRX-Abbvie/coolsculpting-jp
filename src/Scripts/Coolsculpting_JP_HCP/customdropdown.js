(function ($) {
  var elActive = '';
  $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
          color: "#555", // color
          backgroundColor: "#FFF", // background
          change: function () { }, // event change
      }, options);

      return this.each(function () {

          var selectParent = $(this);
          list = [],
              html = '';

          //parameter CSS
          var width = $(selectParent).width();

          $(selectParent).hide();
          if ($(selectParent).children('option').length == 0) { return; }
          $(selectParent).children('option').each(function () {
              if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
              var ndcValue = $(this).attr('value').toString();
              //console.log("ndcValue : " + ndcValue);
              list.push({
                  value: ndcValue,
                  text: $(this).html(),
                  selected: s,
              });
          });
          //console.log("list[0] : " + list[0].value);
          //console.log("list[1] : " + list[1].value);
          // style
          var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

          html += "<ul class='selectCF'>";
          html += "<li>";
          html += "<span class='arrowCF'></span>";
          html += "<span class='titleCF' style='" + style + "; width:" + width + "px'><span>" + title + "</span></span>";
          html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
          html += "<ul>";
          $.each(list, function (k, v) {
              s = (v.selected == 1) ? "selected" : "";
              //console.log("v.value : " + v.value);
              html += "<li data-value='" + v.value + "' value='" + v.value + "' class='" + s + "'><span>"+ v.text +"</span></li>";
          })
          html += "</ul>";
          html += "</li>";
          html += "</ul>";
          $(selectParent).after(html);
          var customSelect = $(this).next('ul.selectCF'); // add Html
          var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
          var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
          var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

          // handle active select
          $(customSelect).unbind('click').bind('click', function (e) {
              e.stopPropagation();
              if ($(this).hasClass('onCF')) {
                  elActive = '';
                  $(this).removeClass('onCF');
                  $(this).removeClass('searchActive'); $(seachElInput).val('');
                  $(seachElOption).show();
              } else {
                  if (elActive != '') {
                      $(elActive).removeClass('onCF');
                      $(elActive).removeClass('searchActive'); $(seachElInput).val('');
                      $(seachElOption).show();
                  }
                  elActive = $(this);
                  $(this).addClass('onCF');
                  $(seachEl).children('input').focus();
              }
          })

          // handle choose option
          var optionSelect = $(customSelect).children('li').children('ul').children('li');
          $(optionSelect).bind('click', function (e) {
              var value = $(this).attr('value');
              if ($(this).hasClass('selected')) {
                  //
              } else {
                  $(optionSelect).removeClass('selected');
                  $(this).addClass('selected');
                  $(customSelect).children('li').children('.titleCF').html("<span>"+$(this).find('span').html()+"</span>");
                  $(selectParent).val(value);
                  settings.change.call(selectParent); // call event change
              }
          })

          // handle search 
          $(seachEl).children('input').bind('keyup', function (e) {
              var value = $(this).val();
              if (value) {
                  $(customSelect).addClass('searchActive');
                  $(seachElOption).each(function () {
                      if ($(this).text().search(new RegExp(value, "i")) < 0) {
                          // not item
                          $(this).fadeOut();
                      } else {
                          // have item
                          $(this).fadeIn();
                      }
                  })
              } else {
                  $(customSelect).removeClass('searchActive');
                  $(seachElOption).fadeIn();
              }
          })
      });
  };
  $(document).click(function () {
      if (elActive != '') {
          $(elActive).removeClass('onCF');
          $(elActive).removeClass('searchActive');
      }
  });
 
}(jQuery));

$(function () {
  $(".customSelect").selectCF({
      change: function () {
          var value = $(this).val();
          var text = $(this).children('option:selected').html();
          // console.log(value + ' : ' + text);
          $(this).siblings('input[type=hidden]').val(text);
          if (text != 'select') {
              $(this).siblings('.selectCF').removeClass('invalid-error');
              $(this).siblings('.invalid-feedback').removeClass('show');
          }
      },
      backgroundColor: "#fff",
      color: '#555',
      width: '100%'
  });
  $('.customSelect').on('click', function () {
      if ($('body').attr('data-iseeditor')=="1") {
          if ($(this).hasClass('show')) {
              $(this).removeClass('show');
          } else {
              $(this).addClass('show');
          }
      }
  })

});