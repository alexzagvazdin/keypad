jQuery keypad plugin
====================
This plugin is made for displaying numeric keypad on touchscreen devices. Try [demo](http://rawgit.com/alexzagvazdin/keypad/master/demo.html).

Usage
-----
* Include `jquery.keypad.css` in the head of your html document.

  ```
  <link rel="stylesheet" type="text/css" href="jquery.keypad.css">
  ```

* Include `jquery.keypad.js` at the bottom after jQuery.

  ```
  <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="jquery.keypad.js"></script>
  ```

* Use `keypad` function on jQuery object for the input field.

  ```
  $(document).ready(function() {
      $('#inputField').keypad();
  });
  ```

The plugin will replace a standard input field with a custom element on touch enabled devices and would display a keypad if the user taps in the field. For Windows laptops and tablets with touch screen, mouse click will display the regular text input allowing to use the hardware keyboard to enter the numbers. 

Advanced options
---------------
You can customize the plugin by providing a hash with options on initialization. eg:

```
$(document).ready(function() {
    $('#keypad').keypad({
       inputCssClass: "myCss", // useful to inherit the CSS styles from the input field
       showIncDec: true, // shows the "+" and "-" buttons in the keypad allowing to increment and decrement the numbers being enetered
       showDecimal: true // shows the button for the decimal divider
    });
});
```

Default options:

```
{
      keypadDiv: '#keypad_inner',
      keypadPlaceholderDiv: '#keypad_placeholder',
      height: 460,
      buttonTemplate: '<button></button>',
      deleteButtonText: 'del',
      deleteButtonClass: 'delete',
      showDecimal: false,
      showIncDec: false,
      inputCssClass: ""
}
```