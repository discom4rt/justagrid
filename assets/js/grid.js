var Grid = function( container ) {
  this.$container = $(container);
   
  this.width = Grid.DEFAULT_DIMENSION;
  this.height = Grid.DEFAULT_DIMENSION;
  this.locked = false;

  this.setup();
};

Grid.prototype = {

  /**
   * Get things going by adding a some style declarations and 
   * setting up our mouse events.
   **/
  setup: function() {
     var styles = '',
      decl;

    // add styles for grid
    this.$style = $('<style>').attr({
      'id': 'grid-style',
      'type': 'text/css'
    });

    styles += '#grid {';
    for( decl in Grid.GRID_CSS ) {
      styles += decl + ':' + Grid.GRID_CSS[decl] + ';';
    }
    styles += '}';

    styles += '#grid .row {';
    for( decl in Grid.ROW_CSS ) {
      styles += decl + ':' + Grid.ROW_CSS[decl] + ';';
    }
    styles += '}';

    styles += '#grid .cell {';
    for( decl in Grid.CELL_CSS ) {
      styles += decl + ':' + Grid.CELL_CSS[decl] + ';';
    }
    styles += '}';

    this.$style.html(styles);
    $('head').append(this.$style);

    this.$grid = $('<div>').attr({
      id: 'grid'
    });

    this.$container.append(this.$grid);

    this.$grid.on('mousemove touchmove', $.proxy(this.cycle, this));
    this.$grid.on('click', $.proxy(this.lock, this));
    this.render();
  },

  /**
   * Change the dimensions and colors of the grid as the mouse is moved.
   **/
  cycle: function( event ) {
    var x, y, diffX, diffY, newX, newY;

    event.preventDefault();

    if( this.locked ) {
      return;
    }

    x = event.pageX || event.originalEvent.touches[0].pageX || event.originalEvent.changedTouches[0].pageX;
    y = event.pageY || event.originalEvent.touches[0].pageY || event.originalEvent.changedTouches[0].pageY;
    diffX = Math.floor(x/this.$container.width() * Grid.MAX_DIMENSION);
    diffY = Math.floor(y/this.$container.height() * Grid.MAX_DIMENSION);
    newX = Math.min(Math.max(Grid.MIN_DIMENSION, diffX), Grid.MAX_DIMENSION);
    newY = Math.min(Math.max(Grid.MIN_DIMENSION, diffY), Grid.MAX_DIMENSION);

    this.width = newX;
    this.height = newY;
    this.render();
  },

  /**
   * Toggle further mouse moved from changing the dimensions/color of the grid.
   **/
  lock: function( event ) {
    this.locked = !this.locked;
  },

  /**
   * Render the grid in its entirety.
   **/
  render: function() {
    var width = Math.ceil(this.$container.width()/this.width) + 'px',
      i = this.width * this.height,
      $row,
      $col;

    this.$grid.empty();

    while(i--) {
      if( (i + 1) % this.width === 0 ) {
        $row = $('<div>').addClass('row');
        this.$grid.append($row);
      }

      $col = $('<div>').addClass('cell').css({
        'background-color': this.randomColor(),
        'width': width
      });
      $row.append($col);
    }
  },

  /**
   * Get a random color fancily.
   **/
  randomColor: function() {
    return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
  }

};

Grid.MIN_DIMENSION = 1;
Grid.MAX_DIMENSION = 50;
Grid.DEFAULT_DIMENSION = Math.floor(Grid.MAX_DIMENSION/2);

// Styles
Grid.GRID_CSS = {
  'width': '100%',
  'height': '100%',
  'display': 'table'
};

Grid.ROW_CSS = {
  'display': 'table-row'
};

Grid.CELL_CSS = {
  'display': 'table-cell'
};

Grid.DISPLAY_CSS = {
  'background': 'transparent',
  'bottom': 0,
  'height': '10%',
  'left': 0,
  'margin': 'auto',
  'position': 'absolute',
  'top': 0,
  'right': 0,
  'width': '20%',
  'text-align': 'center',
  'color': 'white',
  'font-size': '64px',
  'user-select': 'none',
  'cursor': 'default'
};

window.Grid = Grid;