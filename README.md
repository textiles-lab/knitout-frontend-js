# knitout-frontend-js
 

A javascript wrapper for all operations supported by knitout with basic error and type checking.


In the table below:

* `carriers`  specify the yarn-carriers in use. These are specified as a positive integer Number value or Array. Multiple yarn carriers can be used for e.g., in plating.

* `direction`  specifies the direction in which the operation is performed. Legal values include **"+"** indicating increasing needle number direction or **"-"** indicating decreasing needle number direction.

* `bed+needle` is an alpha-numeric value that specifies the bed and needle number. Legal values for `bed` are (**f**)ront, (**b**)ack, (**h**)olding (**f**)ront, (**h**)olding(**b**)ack. Needle is a Number value within the range supported by the machine. "hf10", for example, specifies front-bed slider or holding location 10, "b20" specifies back-bed needle 20. The front-end also allows specifying bed needles as {bed:`value`, needle: `value`} or [`bed`,`needle`].

All knitout opcodes are supported as a front-end function. Currently, the frontend supports:

Function | Arguments | Example | Description
--- | --- | --- | ---
addHeader | `name`(String),`value`(String) |  addHeader('Machine', 'SWGXYZ')| Add header information as name,value pairs. This is also used for including [extensions](https://textiles-lab.github.io/knitout/extensions.html).
in  | `carriers` | in([5,6]) | Bring in yarn 
inhook | `carriers` | inhook([5,6]) | Bring in yarn using the yarn inserting hook
releasehook    | `carriers` | releasehook(5) | Release the yarn inserting hook
out | `carriers` | out([6]) | Take out yarn 
outhook | `carriers` | outhook([5,6]) | Take out yarn with yarn inserting hook
stitch | `before`(Number) `after`(Number) | stitch(25,40) | Before forming the loop, pull needle by `before` machine units, after forming the loop by `after` machine units. *Not supported by the back-end currently*.
stitchNumber|`index`(Number)  | stitchNumber(5) | Explicit function for using stitch number extension that reads stitch values at `index` from a table. See [extensions](https://textiles-lab.github.io/knitout/extensions.html) for details.
rack | `rack value`(Number) | rack(1) | Translate the back bed relative to the front bed by `rack value` needle units. Fractional values are legal and may be supported by the machine.
tuck | `direction`,`bed+needle`,`carriers` | tuck("+","f10",10) | Tuck on `bed` at `needle` using `carriers` in `direction` direction. 
knit | `direction`,`bed+needle`,`carriers` | knit("+","f10",10) | Knit on `bed` at `needle` using `carriers` in `direction` direction. 
xfer | `from bed+needle`,`to bed+needle` | xfer("f10","b10") | Transfer loops from `from bed` at `needle` to  `to bed` at `needle`. 
miss | `direction`,`bed+needle`,`carriers` | miss("+","f10",10) | Miss on `bed` at `needle` using `carriers` in `direction` direction i.e., perform carrier motion without knitting
split| `direction`,`from bed+needle`,`to bed+needle`, `carriers` | split("+","f10", "b10", 10) | Pull a loop from `from bed+needle` and transfer old loops to `to bed+needle` in   `direction` using `carriers`. *Not supported by the back-end currently*. 
drop| `bed+needle`| drop("f10") | Drop loops from `bed+needle`.
amiss| `bed+needle`| amiss("f10") | Tuck operation at `bed+needle` without using yarn. 
pause| None | pause() | Pause machine when instruction is encountered
comment| String | comment("This is a \n multi-line comment") | Insert comments into knitout file

See [knitiout extensions](https://textiles-lab.github.io/knitout/extensions.html) for extensions that can be added as 'headers'. See [knitout specification](https://textiles-lab.github.io/knitout/knitout.html) for further details.

See hello_world.js for example usage.