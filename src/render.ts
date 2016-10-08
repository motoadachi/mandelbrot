// Mandelbrot sample program


// Convert wavelength to RGB values
// http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.htm

function WLtoRGB(wavelength: number): number[] {
	let gamma: number = 0.8;
    let factor:number;
	let red: number
	let green: number;
	let blue:number;

    if((wavelength >= 380) && (wavelength<440)){
        red = -(wavelength - 440) / (440 - 380);
        green = 0.0;
        blue = 1.0;
    }else if((wavelength >= 440) && (wavelength<490)){
        red = 0.0;
        green = (wavelength - 440) / (490 - 440);
        blue = 1.0;
    }else if((wavelength >= 490) && (wavelength<510)){
        red = 0.0;
        green = 1.0;
        blue = -(wavelength - 510) / (510 - 490);
    }else if((wavelength >= 510) && (wavelength<580)){
        red = (wavelength - 510) / (580 - 510);
        green = 1.0;
        blue = 0.0;
    }else if((wavelength >= 580) && (wavelength<645)){
        red = 1.0;
        green = -(wavelength - 645) / (645 - 580);
        blue = 0.0;
    }else if((wavelength >= 645) && (wavelength<781)){
        red = 1.0;
        green = 0.0;
        blue = 0.0;
    }else{
        red = 0.0;
        green = 0.0;
        blue = 0.0;
    };

    // Let the intensity fall off near the vision limits

    if((wavelength >= 380) && (wavelength<420)){
        factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
    }else if((wavelength >= 420) && (wavelength<701)){
        factor = 1.0;
    }else if((wavelength >= 701) && (wavelength<781)){
        factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
    }else{
        factor = 0.0;
    };


	let rgb:number[] = [0, 0, 0];

    rgb[0] = red==0.0 ? 0 : Math.round(255 * Math.pow(red * factor, gamma));
    rgb[1] = green==0.0 ? 0 : Math.round(255 * Math.pow(green * factor, gamma));
    rgb[2] = blue==0.0 ? 0 : Math.round(255 * Math.pow(blue * factor, gamma));

    return rgb;
}


// Claculate Mandelbrot

class Mandelbrot {
	private buf: number[][];
	private rgb: string[];
	
	constructor(public width:number, public height:number){
        this.buf = [];
		for(let i=0 ; i<height ; i++){
			this.buf[i] = [];
			for( let j=0 ; j<width ; j++){
				this.buf[i][j] = 0;
			}
		}

		this.rgb = [];
		let dwl = (780 - 380) / 1023;
		let wl = 380;
		this.rgb[0] = "rgb(0,0,0)";
		for (let i = 1; i < 1024; i++){
			let v = WLtoRGB(wl);
			this.rgb[i] = "rgb(" + v[0] + "," + v[1] + "," + v[2] + ")";
			wl += dwl;
		}
	}
	
	public calc(rp:number, ip:number, range:number):void{
        let maxLoop:number = 1024;
        let r = range/2.0;
        let rmin = rp-r;
        let rmax = rp+r;
        let imin = ip-r;
        let imax = ip+r;
	    let dr = (rmax-rmin)/(this.width-1);
		let di = (imax - imin) / (this.height - 1);
		let ci:number = imin;
		let cr: number;
		let zr: number;
		let zi: number;
		let vr: number;
		let vi: number;
		for(let i=0 ; i<this.height ; i++){
			cr = rmin;
			for(let j=0 ; j<this.width ; j++){
				zr=0;
				zi=0;
				for (let k = 1; k <= maxLoop; k++) {
                    vr = zr * zr - zi * zi + cr;
                    vi = 2 * zr * zi + ci;
					if ((vr * vr + vi * vi) > 4) {
						this.buf[i][j] = k;
						break;
					}
                    zr = vr;
					zi = vi;
				}
				cr += dr;
			}
			ci += di;
		}
	}
	
	public render(ctx){
		for(let i=0 ; i<this.height ; i++){
		    for(let j=0 ; j<this.width ; j++){
				let c = this.buf[i][j];
				ctx.fillStyle = this.rgb[c];
			    ctx.fillRect(j,i,j+1,i+1);
		    }
	    }
	}
	
}
	


function exec() {
    let canv = document.createElement("canvas");
    canv.width = 512;
    canv.height = 512;
    document.body.appendChild(canv);
	let ctx = canv.getContext("2d");
	let f: Mandelbrot;
	f = new Mandelbrot(canv.width,canv.height);
	//f.calc(-0.85, 0, 2.7);
	//f.calc(-0.04, -0.69, 0.01);
	//f.calc(-1.255, 0.0255, 0.00125);
	f.calc(-1.2499, 0.0254, 0.0001);
	//f.calc(-1.24985, 0.02535, 0.000025);
    return f.render(ctx);
}

exec();

