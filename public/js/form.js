(($) => {

    class Toggle {
  
      constructor(element, options) {         
        this.$element = element;
        this.$button = $(`<button class="btn-toggle-pass"><i class="far fa-eye"></i></button>`);
        this.init();
      };
  
     
      init() {
  
        this._appendButton();
        this.bindEvents();
      }
  
      _appendButton() {
        this.$element.after(this.$button);
      }
  
      bindEvents() {
  
        this.$button.on('click touchstart', this.handleClick.bind(this));
      }
  
      handleClick() {
  
        let type = this.$element.attr('type');
  
        type = type === 'password' ? 'text' : 'password';
  
        this.$element.attr('type', type);
        this.$button.toggleClass('active');
      }
    }
  
    $.fn.togglePassword = function () {
      return this.each(function () {
        new Toggle($.this);
      });
    }
  
  })(jQuery);
  
  $(document).ready(function() {
    $('#rpassword').togglePassword();
    $('#password').togglePassword();
  })
  