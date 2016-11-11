var CutImage = function(img, options) {
   if (!(img instanceof HTMLElement && img.tagName === 'IMG')) {
      console.error('CutImage: Допускается применение только к изображениям');
      return
   }

   var
       imgCoordinates = this._getCoordinates(img);

   this._mainDiv = this._createDivWithClass('CutImage__main');
   this._rectangle = this._createDivWithClass('CutImage__rectangle');
   this._ellipse = this._createDivWithClass('CutImage__ellipse');

   this._mainDiv.appendChild(this._rectangle);
   this._rectangle.appendChild(this._ellipse);


   this._mainDiv.style.left = imgCoordinates.left;
   this._mainDiv.style.top = imgCoordinates.top;
   this._mainDiv.style.width = img.clientWidth;
   this._mainDiv.style.height = img.clientHeight;

   if (options.size) {
      options.size = options.size.split(':');
      this._width = options.size[0];
      this._height = options.size[1];

      if (!(this._width || this._height)) {
         console.error('CutImage: неверное соотношение размеров');
         return;
      }
   }

   this._subscribeOnMouseEvent();

   document.getElementsByTagName('body')[0].appendChild(this._mainDiv);
};

CutImage.prototype._createDivWithClass = function(className) {
   var result = document.createElement('div');

   result.className = className;
   return result;
};

CutImage.prototype._getCoordinates = function(elem) {
   var box = elem.getBoundingClientRect();

   return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
   }
};

CutImage.prototype._subscribeOnMouseEvent = function() {
   var
       self = this,
       mouseMove = function(event) {
          var
              rectangleLeftOffset =  parseInt(self._rectangle.style.left.substr(0, self._rectangle.style.left.length - 2)),
              rectangleWidth;

          rectangleWidth = Math.abs(event.offsetX - rectangleLeftOffset);
          self._rectangle.style.height = ((rectangleWidth * self._height) / self._width) + 'px';
          self._rectangle.style.width = rectangleWidth + 'px';
       };

   this._mainDiv.addEventListener('mousedown', function(event) {
      self._rectangle.style.left = event.offsetX + 'px';
      self._rectangle.style.top = event.offsetY + 'px';
      self._mainDiv.addEventListener('mousemove', mouseMove);
   });
};