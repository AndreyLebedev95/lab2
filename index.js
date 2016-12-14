window.onload = function() {
   var
       img1 = document.getElementById('img1'),
       img2 = document.getElementById('img2'),
       preview1 = document.getElementById('preview1'),
       preview2 = document.getElementById('preview2');

   var img1Cut = new CutImage(img1, {
      size: '6:3',
      preview: [{
         el: preview1,
         isEllipse: false,
         width: 200
      }]
   });

   var img2Cut = new CutImage(img2, {
      size: '4:3',
      preview: [{
         el: preview2,
         isEllipse: true,
         width: 300
      }]
   });

};