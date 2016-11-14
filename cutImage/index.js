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
   this._topLeftResize = this._createDivWithClass('CutImage__topLeftResize');
   this._topRightResize = this._createDivWithClass('CutImage__topRightResize');
   this._bottomLeftResize = this._createDivWithClass('CutImage__bottomLeftResize');
   this._bottomRightResize = this._createDivWithClass('CutImage__bottomRightResize');

   this._mainDiv.appendChild(this._rectangle);
   this._rectangle.appendChild(this._ellipse);
   this._rectangle.appendChild(this._topLeftResize);
   this._rectangle.appendChild(this._topRightResize);
   this._rectangle.appendChild(this._bottomLeftResize);
   this._rectangle.appendChild(this._bottomRightResize);


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
       lastMouseX = 0,
       mouseMove = function(event) {
          var
              rectangleLeftOffset =  parseInt(self._rectangle.style.left.substr(0, self._rectangle.style.left.length - 2)),
              rectangleWidth,
              cursorOffset = self._screenToOffset(self._mainDiv, event);

          lastMouseX = event.offsetX;
          rectangleWidth = Math.abs(cursorOffset.x - rectangleLeftOffset);
          self._rectangle.style.height = ((rectangleWidth * self._height) / self._width) + 'px';
          self._rectangle.style.width = rectangleWidth + 'px';
       },
       mouseUp = function(event) {
          lastMouseX = event.offsetX;
          self._mainDiv.removeEventListener('mousemove', mouseMove);
          self._mainDiv.removeEventListener('mouseup', mouseUp);
       },
       mouseMoveBottomRight = function(event) {
          var
              rectangleLeftOffset =  parseInt(self._rectangle.style.left.substr(0, self._rectangle.style.left.length - 2)),
              rectangleWidth,
              cursorOffset = self._screenToOffset(self._mainDiv, event);

          lastMouseX = event.offsetX;
          rectangleWidth = Math.abs(cursorOffset.x - rectangleLeftOffset);
          self._rectangle.style.height = ((rectangleWidth * self._height) / self._width).toFixed() + 'px';
          self._rectangle.style.width = rectangleWidth + 'px';
       },
       mouseUpBottomRight = function(event) {
          self._mainDiv.removeEventListener('mousemove', mouseMoveBottomRight);
          self._mainDiv.removeEventListener('mouseup', mouseUpBottomRight);
       },
       mouseMoveBottomLeft = function(event) {
          var
              rectangleTopOffset =  self._parseStyle(self._rectangle.style.top),
              rectangleLeftOffset = self._parseStyle(self._rectangle.style.left),
              rectangleHeight,
              cursorOffset = self._screenToOffset(self._mainDiv, event),
              oldWidth = self._parseStyle(self._rectangle.style.width);

          lastMouseX = event.offsetX;
          rectangleHeight = Math.abs(cursorOffset.y - rectangleTopOffset);
          self._rectangle.style.width = ((rectangleHeight * self._width) / self._height).toFixed() + 'px';
          self._rectangle.style.height = rectangleHeight + 'px';
          self._rectangle.style.left = (rectangleLeftOffset - (self._parseStyle(self._rectangle.style.width) - oldWidth)) + 'px';
       },
       mouseUpBottomLeft = function(event) {
          self._mainDiv.removeEventListener('mousemove', mouseMoveBottomLeft);
          self._mainDiv.removeEventListener('mouseup', mouseUpBottomLeft);
       },
       mouseMoveTopRight = function(event) {
          var
              rectangleLeftOffset =  self._parseStyle(self._rectangle.style.left),
              rectangleTopOffset = self._parseStyle(self._rectangle.style.top),
              rectangleWidth,
              cursorOffset = self._screenToOffset(self._mainDiv, event),
              oldHeight = self._parseStyle(self._rectangle.style.height);

          lastMouseX = event.offsetX;
          rectangleWidth = Math.abs(cursorOffset.x - rectangleLeftOffset);
          self._rectangle.style.height = ((rectangleWidth * self._height) / self._width).toFixed() + 'px';
          self._rectangle.style.width = rectangleWidth + 'px';
          self._rectangle.style.top = (rectangleTopOffset - (self._parseStyle(self._rectangle.style.height) - oldHeight)) + 'px';
       },
       mouseUpTopRight = function(event) {
          self._mainDiv.removeEventListener('mousemove', mouseMoveTopRight);
          self._mainDiv.removeEventListener('mouseup', mouseUpTopRight);
       },
       mouseMoveTopLeft = function(event) {

       },
       mouseUpTopLeft = function(event) {

       },
       stop = function() {
          return false;
       };

   this._mainDiv.addEventListener('mousedown', function(event) {
      lastMouseX = event.offsetX;
      self._rectangle.style.width = '0px';
      self._rectangle.style.height = '0px';
      self._rectangle.style.left = event.offsetX + 'px';
      self._rectangle.style.top = event.offsetY + 'px';
      self._mainDiv.addEventListener('mousemove', mouseMove);
      self._mainDiv.addEventListener('mouseup', mouseUp);
   });
   this._bottomRightResize.addEventListener('mousedown', function(event) {
      event.stopPropagation();
      self._mainDiv.addEventListener('mousemove', mouseMoveBottomRight);
      self._mainDiv.addEventListener('mouseup', mouseUpBottomRight);
   });
   this._bottomLeftResize.addEventListener('mousedown', function(event) {
      event.stopPropagation();
      self._mainDiv.addEventListener('mousemove', mouseMoveBottomLeft);
      self._mainDiv.addEventListener('mouseup', mouseUpBottomLeft);
   });
   this._topRightResize.addEventListener('mousedown', function(event) {
      event.stopPropagation();
      self._mainDiv.addEventListener('mousemove', mouseMoveTopRight);
      self._mainDiv.addEventListener('mouseup', mouseUpTopRight);
   });

   this._mainDiv.ondragstart = stop;
   this._topLeftResize.ondragstart = stop;
   this._topRightResize.ondragstart = stop;
   this._bottomLeftResize.ondragstart = stop;
   this._bottomRightResize.ondragstart = stop;
};

CutImage.prototype._screenToOffset = function(elem, event) {
   var elemScreenCoordinates = elem.getBoundingClientRect();

   return {
      x: event.pageX - elemScreenCoordinates.left,
      y: event.pageY - elemScreenCoordinates.top
   };
};

CutImage.prototype._parseStyle = function(styleString) {
   return parseInt(styleString.substr(0, styleString.length - 2));
};