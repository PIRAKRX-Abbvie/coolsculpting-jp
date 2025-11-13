$(document).ready(function () {
  var screenWidth = $(window).width();
  var baseURL = location.origin + '/hcp/';
  // if(baseURL.includes('#')) {
  //     baseURL = baseURL.split('#')[0];
  // }
  $('#phone').attr('minlength', 5); // Max length restriction

  //To set the mandatory condition dynamically in form fields on page Load
  $('.form-control').each(function () {
      if ($(this).attr('data-mandatory') === 'true') {
          $(this).prop('required', true);
      } else {
          $(this).prop('required', false);
      }
  });

  //To set the mandatory condition for consent checkbox in form
  if ($('.form-check-input').attr('data-mandatory') === 'true') {
      $('.form-check-input').prop('required', true);
  } else {
      $('.form-check-input').prop('required', false);
  }

  //Toggle Hamburger menu in mobile view
  $('.navbar-toggler').on('click', function () {
      if ($(window).width() < 992) {
          if (!$('.navigationLinks .top-nav, .navbar-toggler').hasClass('showContent')) {
              $('.navigationLinks .top-nav, .navbar-toggler').addClass('showContent');
          } else {
              $('.navigationLinks .top-nav, .navbar-toggler').removeClass('showContent');
          }
      }
  });

  // Set Active Header menu on click 
  $('.navigationLinks .top-nav .nav-item').on('click', function () {
      $('.navigationLinks .top-nav .nav-item').removeClass('active');
      $(this).addClass('active');
      if ($(window).width() < 992) {
          $('.navigationLinks .top-nav, .navbar-toggler').removeClass('showContent');
      }
  });

  // Jump Links Smooth Scrolling
  if (!location.pathname.includes('404') && !location.pathname.includes('500')) {
      $('header .navigationLinks .top-nav .nav-item').on('click', function (e) {
          try {
              e.preventDefault();
              var ele = $(this)[0].children[0].getAttribute('href').split('#')[1];
              var offset;
              if ($('#' + ele)[0] !== undefined) {
                  offset = $('#' + ele)[0].offsetTop;
                  $('html, body').animate({
                      scrollTop: offset + 10
                  }, 'smooth');
              }
              location.href = baseURL + '#' + ele;
          } catch (e) { }
      });
  }

  viewPortChange();

  if ($(window).width() < 992) {
      try {
          $('.before-after .multicolumn .col-12 .row').slick({
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: false,
              autoplaySpeed: 3000,
          });

          $('.science-of-evolution .col-12 .row:nth-child(2)').slick({
              dots: false,
              infinite: false,
              speed: 300,
              slidesToShow: 3,
              slidesToScroll: 1,
              responsive: [
                  {
                      breakpoint: 767,
                      settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          autoplay: false,
                          autoplaySpeed: 3000,
                          infinite: false,
                          centerMode: true,
                          centerPadding: '65px',
                          arrows: true,

                      }
                  }
              ]
          });


      } catch (e) {
          console.log(e);
      }
  }

  //****** Video Script Starts ******/
  try {
      var player1 = (typeof Vimeo !== 'undefined') ? (new Vimeo.Player($('.banner-sec .video-wrapper iframe'))) : null;
      if (player1 != null) {
          if (localStorage.getItem('initialPopup') !== null) {
              //player1.play();
          }
          player1.on('ended', function () {
              // var videoSrc = player1.element.src;
              // player1.element.src = '';
              // player1.element.src = videoSrc;
              setTimeout(function () {
                  player1.unload();
              }, 500)
          });

          player1.on('finish', function () {
              console.log('HERE...!');
          })
      }

      // $(window).scroll(function() {
      //     if($(window).scrollTop() === 0) {
      //         setTimeout(function() {
      //             player1.unload();
      //         }, 500);
      //     }
      // });

  } catch (e) {
      console.log(e)
  }

  //******* Video Script Ends *******/

  //*****MODAL Script Starts*****//

  $('#confirmation-popup').attr('data-backdrop', 'static'); // TO disable popup close while clicking outside the modal

  // if (localStorage.getItem('initialPopup') === null) {
  //     $('#confirmation-popup').modal('show');
  // }

  $('#confirmation-popup .modal-body .nav-item a.nav-link').on('click', function () {
      setTimeout(() => {
          $('#confirmation-popup').modal('hide');
      }, 1500);
  });

  $('#internal-link, #external-link').on('click', function () {
      $('#confirmation-popup').modal('hide');
      localStorage.setItem('initialPopup', true);
  });

  $('#internal-link').on('click', function () {
      if (player1 != null) {
          player1.play();
      }
  });

  //*****MODAL Script Ends*****//

  //******* FORM Script Starts *******//

  // $('#phone').on('keypress', function (e) {
  //     if ($(this).val().toString().length > 10) {
  //         e.preventDefault();
  //         return false;
  //     }
  // });

  $('#checkbox').on('change', function () {
      if ($(this).prop('checked')) {
          $('.form-check').find('.invalid-feedback').removeClass('show');
      }
  });

  $('#form-submit-button').on('click', function () {
    var isFormValid = false;
    var formData = {};
    isFormValid = validateForm();

    var response = grecaptcha.getResponse();
    if (response.length == 0) {
      document.getElementById('g-recaptcha-error').innerHTML = '<span class="invalid-feedback show">recaptchaを正しく解いてください</span>';
    } else {
      if (isFormValid) {
        console.log(response);

      document.getElementById('g-recaptcha-error').innerHTML = '';
      $('.form-check').find('.invalid-feedback').removeClass('show');
      formData.fullName = $('#name').val();
      formData.clinicName = $('#clinicname').val();
      formData.email = $('#email').val();
      formData.phoneNumber = $('#phone').val();
      formData.inquiry = $('select#inquery').val();
      formData.message = $('#message').val();
      formData.consent = $('#checkbox').prop('checked');
      formData.recaptchaVerification = response;

      $.ajax({
          url: "/.netlify/functions/submit-form",
          type: "POST",
          // dataType: 'json',
          data: JSON.stringify({
              response: formData
          }),
          success: function (response) {
              $('#form-submit-success').addClass('show');
              $('#form-submit-error').removeClass('show');
              $('#form-submit-button').prop('disabled', true);
              console.log(response);
          },
          error: function (message) {
              $('#form-submit-success').removeClass('show');
              $('#form-submit-error').addClass('show');
              console.log(message.statusText);
          }
      });
      //   }
    } else {
        var offset = $('.form-control.invalid-error').first().length == 0 ? 0 : $('.form-control.invalid-error').first().offset().top;
        if (offset > 0) {
            if (screenWidth > 1024) {
                $('body, html').animate({
                    scrollTop: offset - 100
                }, "slow");
            } else if (screenWidth < 768) {
                $('body, html').animate({
                    scrollTop: offset - 170
                }, "slow");
            }
        }
    }
    }

  });

  // $('.form-control').on('focusin', function () {
  //     $(this).removeClass('invalid-error');
  //     $(this).next('.invalid-feedback').removeClass('show');
  //     $(this).next('.invalid-feedback').next('.additionalText').removeClass('show');
  // });

  $('.form-control').on('focusout', function () {
      // var isValid = validateForm();
      var isValid = false;
      if ($(this).val() !== '') {
          isValid = true;
      }
      if (isValid) {
          $(this).removeClass('invalid-error');
          $(this).next('.invalid-feedback').removeClass('show');
          $(this).next('.invalid-feedback').next('.additionalText').removeClass('show');
      }
  });

  //******* FORM Script Ends *******//

  // Back to top
  // $(window).scroll(function () {
  //     if ($(window).scrollTop() > ($(window).height() / 5)) {
  //         $('.backtotop').show();
  //     } else {
  //         $('.backtotop').hide();
  //     }
  // });

  // $('.backtotop img').on('click', function () {
  //     $('html, body').animate({
  //         scrollTop: 0
  //     }, 500);
  // });


  //**************To FIx JumpLink Landing Position while navigating from 404 or 500 page************/
  $(window).on('load', function () {
      var activeSecID = location.href.split('#')[1];
      if (activeSecID !== undefined && activeSecID !== '') {
          var offset = $('#' + activeSecID)[0].offsetTop;
          $('html, body').animate({
              scrollTop: offset + 10
          }, 'smooth');
      }
  });

  // window.addEventListener('beforeunload', function (e) {
  //     e.preventDefault();
  //     e.returnValue = '';
  //     alert('Browser Close...!')
  // });

});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

document.addEventListener('DOMContentLoaded', () => {
  lineIntr = setInterval(function () {
      if (document.getElementById('onetrust-close-btn-container') != null) {
          clearInterval(lineIntr);
          $('.onetrust-pc-dark-filter').removeClass('ot-hide');
          var btnclick = document.getElementById('onetrust-close-btn-container');
          btnclick.firstChild.addEventListener('click', function () {
              $('.onetrust-pc-dark-filter').addClass('ot-hide');
              if (localStorage.getItem('initialPopup') === null) {
                  $('#confirmation-popup').modal('show');
              }
          });

          var btnclick1 = document.getElementById('onetrust-accept-btn-handler');
          btnclick1.addEventListener('click', function () {
              $('.onetrust-pc-dark-filter').addClass('ot-hide');
              if (localStorage.getItem('initialPopup') === null) {
                  $('#confirmation-popup').modal('show');
              }
          });

          var btnclick2 = document.getElementsByClassName('save-preference-btn-handler')[0];
          btnclick2.addEventListener('click', function () {
              $('.onetrust-pc-dark-filter').addClass('ot-hide');
              if (localStorage.getItem('initialPopup') === null) {
                  $('#confirmation-popup').modal('show');
              }
          });
          var btnclick3 = document.getElementById('close-pc-btn-handler');
          btnclick3.addEventListener('click', function () {
              if ($('#onetrust-banner-sdk').css('display') === 'block') {
                  $('.onetrust-pc-dark-filter').addClass('ot-fade-in');
                  $('.onetrust-pc-dark-filter').removeClass('ot-hide');
                  $('.onetrust-pc-dark-filter').removeAttr('style')
              }
          });

      } else {
          if (getCookie('OptanonConsent') != '' && getCookie('OptanonAlertBoxClosed') != '') {
              clearInterval(lineIntr);
              $('.onetrust-pc-dark-filter').addClass('ot-hide');
              if (localStorage.getItem('initialPopup') === null) {
                  $('#confirmation-popup').modal('show');
              }
          } else {
              $('.onetrust-pc-dark-filter').removeClass('ot-hide');
          }
      }
  }, 100)
});


$(function () {

  var $allVideos = $("iframe[src*='https://player.vimeo.com'], iframe[src*='https://vimeo.com'], iframe[src*='https://www.youtube.com'], iframe[src*='/-/media/Feature/'], object, embed");

  var $fluidEl1 = document.querySelectorAll(".video-wrapper .row");

  var $fluidEl = [];
  for (var i = 0; i < $fluidEl1.length; i++) {

      $fluidEl[i] = $fluidEl1[i];
  }
  $allVideos.each(function () {
      $(this)

          .attr('data-aspectRatio', this.height / this.width)
          .removeAttr('height')
          .removeAttr('width');
  });

  $(window).resize(function () {
      var i = 0;

      $allVideos.each(function () {

          var newWidth = $fluidEl[i].clientWidth;

          var $el = $(this);

          $el.width(newWidth).height(newWidth * $el.attr('data-aspectRatio'));

          i++;

      });



  }).resize();
});
//Multiple Spans for Navbar togggler 
$('header .navbar .navbar-toggler').append('<span></span><span></span>');

//Adding ID's for required Sections
$('.uses-comp').attr('id', 'uses');
$('.references-comp').attr('id', 'references');

function viewPortChange() {
  if ($(window).width() < 992) {
      $('.top-nav-link').insertAfter('.top-nav');
  } else {
      // $('.top-nav').append('.top-nav-link');
  }
}

function validateForm() {
  var is_name_valid, is_clinicname_valid, is_email_valid, is_phone_valid, is_inquiry_valid, is_checkbox_checked = false;
  if ($('#name').val() == '') {
      is_name_valid = false;
      $('#name').addClass('invalid-error');
      $('#name').next('.invalid-feedback').addClass('show');
  } else {
      is_name_valid = true;
      $('#name').removeClass('invalid-error');
      $('#name').next('.invalid-feedback').removeClass('show');
  }

  if ($('#clinicname').val() == '') {
      is_clinicname_valid = false;
      $('#clinicname').addClass('invalid-error');
      $('#clinicname').next('.invalid-feedback').addClass('show');
  } else {
      is_clinicname_valid = true;
      $('#clinicname').removeClass('invalid-error');
      $('#clinicname').next('.invalid-feedback').removeClass('show');
  }

  if ($('#email').val() == '') {
      is_email_valid = false;
      $('#email').addClass('invalid-error');
      $('#email').next('.invalid-feedback').addClass('show');
      $('#email').next('.invalid-feedback').next('.additionalText').removeClass('show');
  } else {
      var emailpass;
      // var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9,-]+\.(?:com|net|org|COM|NET|ORG)$/;
      // var emailPattern = /^.+@.+\.+(?:com|net|org|COM|NET|ORG)$/;
      var emailPattern = /^.+@.+\..+$/;
      emailpass = emailPattern.test($('#email').val());
      if (emailpass == true) {
          is_email_valid = true;
          $('#email').removeClass('invalid-error');
          $('#email').next('.invalid-feedback').removeClass('show');
          $('#email').next('.invalid-feedback').next('.additionalText').removeClass('show');
      } else {
          is_email_valid = false;
          $('#email').next('.invalid-feedback').removeClass('show');
          $('#email').addClass('invalid-error');
          $('#email').next('.invalid-feedback').next('.additionalText').addClass('show');
      }
  }

  if ($('#phone').val() == '' || $('#phone').val().length < 5) {
      is_phone_valid = false;
      $('#phone').addClass('invalid-error');
      $('#phone').next('.invalid-feedback').addClass('show');
  } else {
      is_phone_valid = true;
      $('#phone').removeClass('invalid-error');
      $('#phone').next('.invalid-feedback').removeClass('show');
  }

  if ($('select#inquery').val() == '') {
      is_inquiry_valid = false;
      $('select#inquery').addClass('invalid-error');
      $('select#inquery').next('.invalid-feedback').addClass('show');
  } else {
      is_inquiry_valid = true;
      $('select#inquery').removeClass('invalid-error');
      $('select#inquery').next('.invalid-feedback').removeClass('show');
  }

  if (!$('#checkbox').prop('checked')) {
      $('.form-check').find('.invalid-feedback').addClass('show');
      is_checkbox_checked = false;
  } else {
      is_checkbox_checked = true;
      $('.form-check').find('.invalid-feedback').removeClass('show');
  }

  if (is_name_valid && is_clinicname_valid && is_email_valid && is_phone_valid && is_inquiry_valid && is_checkbox_checked) {
      return true;
  } else {
      return false;
  }

};

function recaptchaCallback() {
  document.getElementById('g-recaptcha-error').innerHTML = '';
};