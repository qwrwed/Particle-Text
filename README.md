# Particle-Text
Display text using particles on a p5.js sketch (portable implementation using classes)
## `ParticleString` Class
A class to describe a string of text, for a p5 canvas, created from a sequence of vehicles (see "`Vehicle` Class" below)
To construct: `new particleString(string, font, [args], [renderer])`
The global variable `allInstances` exists; it is an array of all created instances
of `ParticleString` and can be accessed as such (e.g. `allInstances[0].colour`). 
### `ParticleString` Fields
#### `string`
The text to display in the particle string.
#### `font`
The loaded font to use for the particle string. Running `font = loadFont(fontName)`
(replacing `fontName` with the appropriate string) in the `preload` function is highly
recommended.

#### `args`
Optional object containing optional argument values in JSON format. If 
any or all values are missing, corresponding defaults will be used.
Example: `args = {x : 300, y : height/2, colour : 'orange'}`
Attribute names and corresponding defaults are listed below.

| Attribute    | Default Value                                      |
|--------------|----------------------------------------------------|
| colour       | 255 (white)                                        |
| fontSize     | 40                                                 |
| font         | `font` as passed into function                     |
| id           | `string` as passed into function                             |
| x            | half the width of the canvas/renderer              |
| y            | half the height of the canvas/renderer             |
| sampleFactor | sampleScale(defaults to 13)/fontSize               |
| particleSize | 0.03 * fontSize                                    |

`particleString` has all of the attributes tabulated above, along with attributes `posX` and `posY`.
These two attributes hold the location to start drawing the string (the top-left corner),
whereas `x` and `y` hold the location of the centre of the string.
Getters and setters are available for 
all attributes of `particleString` except for`font`, `x`, `y`, `posX` and `posY`.


#### `renderer`
Optional p5.Renderer object to draw to, e.g. `renderer = createGraphics()`  
To leaves  `args` empty while still using a renderer, use `{}`:
`new particleString(myString, myFont, {}, myRenderer)`

### `ParticleString` Methods 
#### `draw([renderer])`
Draw the particle string to the graphics object, or the renderer if it exists. 
This should be called in the p5 draw() function.

## `ParticleClock` Class
This class simply extends the `ParticleString` class. Syntax and methods are largely the same,
except for the constructor: `new particleClock(font,[args],[renderer])`

## `Vehicle` Class
Note: Generally only used by the `particle` 
A class to describe a single particle that will be attracted to a predetermined point
(target) and repulsed from the mouse position (when this is near enough).  
To construct: `new Vehicle(x,y,size,colour)`
### `Vehicle` Fields
#### `x`
The x-coordinate, in pixels, of the location of the particle at rest (the target).
#### `y`
The y-coordinate, in pixels, of the location of the particle at rest (the target).
#### `size`
The radius of the particle.
#### `colour`
The colour of the particle. Due to how p5 works, this can be in a variety
of formats; 'blue', '#00f', '0000ff' and rgb(0,0,255) are equivalent.
### `Vehicle` Methods
#### `draw([renderer])`
Update the visual and kinematic properties of the vehicle, and show them
on the canvas (or the renderer, if optional parameter `renderer` is given).
