<script>
	import { onMount } from 'svelte';
	let selected_tool_index = 14;
	let selected_material_index = 0;
	export let tools;
	export let materials;
	let thumbnails = [];
	let descriptions = [];
	let requirements = [];
	let material_thumbnails = [];
	let material_descriptions = [];
	let material_mapping;
	let svg = {
		line_thickness : 5,
		long_height : 100,
		long_width : 100,
		height : 100,
		width : 40,

		offset : 0,
		t_l : {x:0,y:0},
		b_l : {x:0,y:0},
		t_r : {x:0,y:0},
		b_r : {x:0,y:0},
		l_t : {x:0,y:0},
		r_t : {x:0,y:0},
		l_b : {x:0,y:0},
		r_b : {x:0,y:0},
		i_t_l : {x:0,y:0},
		i_b_l : {x:0,y:0},
		i_t_r : {x:0,y:0},
		i_b_r : {x:0,y:0},
		t_l_l : {x:0,y:0},
		b_l_l : {x:0,y:0},
		t_r_l : {x:0,y:0},
		b_r_l : {x:0,y:0},
		c_r : 0,
		c_x : 0,
		c_y : 0,
		d_1 : {x1:0,x2:0,y1:0,y2:0,},
		d_2 : {x1:0,x2:0,y1:0,y2:0,},
		d_3 : {x1:0,x2:0,y1:0,y2:0,},
		d_4 : {x1:0,x2:0,y1:0,y2:0,},
		d_5 : {x1:0,x2:0,y1:0,y2:0,},
	}
	svg.offset = svg.line_thickness*1.5;
	let h_h = svg.height/2,
		h_w = svg.width/2,
		h_lt = svg.line_thickness/2,
		h_inc = svg.height/5;

	svg.c_r = svg.line_thickness;
	svg.c_x = svg.width-svg.line_thickness;
	svg.c_y = h_h;

	svg.t_l = {x:0,y:h_h-h_lt};
	svg.b_l = {x:0,y:h_h+h_lt};
	svg.t_r = {x:svg.width,y:h_h-h_lt};
	svg.b_r = {x:svg.width,y:h_h+h_lt};

	svg.l_t = {x:h_w-h_lt,y:0};
	svg.r_t = {x:h_w+h_lt,y:0};
	svg.l_b = {x:h_w-h_lt,y:svg.height};
	svg.r_b = {x:h_w+h_lt,y:svg.height};

	svg.i_t_l = {x:h_w-h_lt,y:h_h-h_lt};
	svg.i_b_l = {x:h_w-h_lt,y:h_h+h_lt};
	svg.i_t_r = {x:h_w+h_lt,y:h_h-h_lt};
	svg.i_b_r = {x:h_w+h_lt,y:h_h+h_lt};

	svg.t_l_l = svg.t_l;
	svg.b_l_l = svg.b_l;
	svg.t_r_l = {x:svg.long_width,y:h_h-h_lt};
	svg.b_r_l = {x:svg.long_width,y:h_h+h_lt};

	svg.d_1 = {x1:svg.l_t.x,x2:svg.r_t.x,y1:      0,y2:      0+svg.line_thickness,};
	svg.d_2 = {x1:svg.l_t.x,x2:svg.r_t.x,y1:h_inc*1,y2:h_inc*1+svg.line_thickness,};
	svg.d_3 = {x1:svg.l_t.x,x2:svg.r_t.x,y1:h_inc*2,y2:h_inc*2+svg.line_thickness,};
	svg.d_4 = {x1:svg.l_t.x,x2:svg.r_t.x,y1:h_inc*3,y2:h_inc*3+svg.line_thickness,};
	svg.d_5 = {x1:svg.l_t.x,x2:svg.r_t.x,y1:h_inc*4,y2:h_inc*4+svg.line_thickness,};

	const get_reducer= (f_ext) => {
		const get_subreducer = (type) => 
			(acc, cur) => 
				[...acc,"./tools/"+type+"/"+cur+f_ext]
		return (acc, cur) => 
			[...acc,cur.tools.reduce(get_subreducer(cur.type),[])]
	}

	onMount(async () => {
		const resolve_to_text = (arr,f_ext) => 
			Promise.all( 
				arr.reduce( 
		 			(acc,cur) => 
						[...acc,
						fetch(cur)
							.then((res) => (f_ext==".txt") ? res.text() : res.json())
							.then((desc) => (f_ext==".txt") ? desc.trim().split("\n") : desc )
						],
					[]
				)
			);
		let desc_urls = tools.reduce(get_reducer(".txt"),[]).join().split(',');
		descriptions = await resolve_to_text(desc_urls,".txt");
		
		let material_desc_urls = materials.reduce((acc,cur) =>[...acc, "./materials/"+cur+".txt"],[]);
		material_descriptions = await resolve_to_text(material_desc_urls,".txt");
		
		thumbnails = tools.reduce(get_reducer(".png"),[]).join().split(',');
		material_thumbnails = materials.reduce((acc,cur) =>[...acc, "./materials/"+cur+".png"],[]);
		
		let mapping_keys = [];
		for ( let i in materials ){
			let l = materials[i].split('_');
			// for ( let j in l ){
			// 	l[j] = l[j].charAt(0).toUpperCase() + l[j].slice(1);
			// }
			l = l.join(' ');
			mapping_keys.push(l);
		}
		let temp_material_mapping = {};
		for ( let i in materials ){
			temp_material_mapping[mapping_keys[i]] = {
				"description":material_descriptions[i],
				"thumbnail":material_thumbnails[i]
			};
		}
		material_mapping = temp_material_mapping;
		let req_urls = tools.reduce(get_reducer(".req"),[]).join().split(',');
		requirements = await //resolve_to_text(req_urls,".req");
			Promise.all( 
				req_urls.reduce( 
					(acc,cur) => 
						[...acc,
						fetch(cur)
							.then((res) => res.text())
							.then((txt) => txt.trim().replace(/\n/g,''))
							.then((txt) => JSON.parse(txt))
						],
					[]
				)
			);
		let img_style = document.createElement('style');
		img_style.type = 'text/css';
		img_style.innerHTML = ".tool-img { min-height:80px;max-width:80px;max-height:80px;min-width:80px;}";
		document.body.appendChild(img_style);
		let tool_indexes = [0,4,7,10,14,18,21,25,31,36,null,26,32,33,34,35,27,28,1 ,19,29,20,30,22,23,24,13,5 ,11,2 ,12,3,8,38,9 ,15,37,16,6 ,39,17];
		document.querySelectorAll(".tool-cube").forEach((el,i)=>{
			if (i==10) return;
			let img = document.createElement("img");
			img.classList.add("tool-img"); 
			let url = thumbnails[tool_indexes[i]];
			img.setAttribute('src',url);
			el.appendChild(img);
			let t_i = tool_indexes[i];
			el.addEventListener("click",(e,el)=>{
				selected_tool_index=t_i;

			})
		});
		document.querySelectorAll(".material-top img").forEach((el,i)=>{
			let t_i = i;
			el.addEventListener("click",(e,el)=>{
				selected_material_index=t_i;

			})
		});
		
	});

</script>
<svg width="0" height="0" viewBox="0 0 {svg.height} {svg.width}">
		<defs>
		<clipPath id="cross-section">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_l.x} {svg.i_t_l.y}, {svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_r.x} {svg.i_b_r.y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y}, {svg.i_b_l.x} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="left-full-vertical">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_l.x} {svg.i_t_l.y}, {svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y}, {svg.i_b_l.x} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="tee-dot">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_r.x} {svg.i_b_r.y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y}, {svg.i_b_l.x} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
		</defs>
	<defs>
		<clipPath id="upsidedown-tee-dot">
            
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			<polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_l.x} {svg.i_t_l.y}, {svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y}," />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="upsidedown-tee">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_l.x} {svg.i_t_l.y}, {svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="tee">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_r.x} {svg.i_b_r.y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y}, {svg.i_b_l.x} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat">
            <polygon points="{svg.t_l_l  .x} {svg.t_l_l  .y}, {svg.t_r_l  .x} {svg.t_r_l  .y}, {svg.b_r_l  .x} {svg.b_r_l  .y}, {svg.b_l_l  .x} {svg.b_l_l  .y},"/>  
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="down">
            <polygon points="{svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat-dot">
            
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			<polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat-bottom-angle-dot">
            <polygon points="{svg.i_t_l.x} {svg.i_t_l.y+svg.offset}, {svg.t_r  .x} {svg.t_r  .y+svg.offset}, {svg.b_r  .x} {svg.b_r  .y+svg.offset}, {svg.i_b_r.x} {svg.i_b_r.y+svg.offset}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y},"/>		
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y},"/>
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
            <circle cy="{svg.c_y+svg.offset}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" /></clipPath>  
	</defs>
    <defs>
		<clipPath id="upsidedown-tee-bottom-angle-dot">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_l.x} {svg.i_t_l.y}, {svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y},"/>
            <polygon points="{svg.i_t_l.x} {svg.i_t_l.y+svg.offset}, {svg.t_r  .x} {svg.t_r  .y+svg.offset}, {svg.b_r  .x} {svg.b_r  .y+svg.offset}, {svg.i_b_r.x} {svg.i_b_r.y+svg.offset}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y},"/>
            
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
            <circle cy="{svg.c_y+svg.offset}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			</clipPath>  
	</defs>
    <defs>
		<clipPath id="upsidedown-angle-bottom-flat-dot">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y},"/>
			<polygon points="{svg.l_t  .x} {svg.l_t  .y},{svg.r_t    .x} {svg.r_t    .y}, {svg.i_t_r  .x} {svg.i_t_r  .y-svg.offset},  {svg.t_r    .x} {svg.t_r    .y-svg.offset}, {svg.b_r    .x} {svg.b_r    .y-svg.offset}, {svg.i_b_l  .x} {svg.i_b_l  .y-svg.offset}, "/>
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
            <circle cy="{svg.c_y-svg.offset}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			</clipPath>  
	</defs>
	<defs>
		<clipPath id="angle-top-right">
            <polygon points="{svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_l.x} {svg.i_b_l.y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="angle-top-right-dot">
            
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			<polygon points="{svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_l.x} {svg.i_b_l.y},"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="angle-left-down">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y}, {svg.i_b_l.x} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
	    </clipPath>  
	</defs>
	<defs>
		<clipPath id="flat-dot-dashed">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.b_l  .x} {svg.b_l  .y},"/>
            <polygon points="{svg.d_1.x2} {svg.d_1.y1}, {svg.d_1.x1} {svg.d_1.y1}, {svg.d_1.x1} {svg.d_1.y2}, {svg.d_1.x2} {svg.d_1.y2}"/>
            <polygon points="{svg.d_2.x2} {svg.d_2.y1}, {svg.d_2.x1} {svg.d_2.y1}, {svg.d_2.x1} {svg.d_2.y2}, {svg.d_2.x2} {svg.d_2.y2}"/>
            <polygon points="{svg.d_3.x2} {svg.d_3.y1}, {svg.d_3.x1} {svg.d_3.y1}, {svg.d_3.x1} {svg.d_3.y2}, {svg.d_3.x2} {svg.d_3.y2}"/>
            <polygon points="{svg.d_4.x2} {svg.d_4.y1}, {svg.d_4.x1} {svg.d_4.y1}, {svg.d_4.x1} {svg.d_4.y2}, {svg.d_4.x2} {svg.d_4.y2}"/>
            <polygon points="{svg.d_5.x2} {svg.d_5.y1}, {svg.d_5.x1} {svg.d_5.y1}, {svg.d_5.x1} {svg.d_5.y2}, {svg.d_5.x2} {svg.d_5.y2}"/>
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			</clipPath>  
	</defs>	        
	<defs>
		<clipPath id="upsidedown-tee-bottom-angle-dot-dash-connect-cross-section">
            <polygon points="{svg.l_t  .x+svg.offset} {svg.l_t  .y}, {svg.r_t  .x+svg.offset} {svg.r_t  .y}, {svg.i_t_r.x+svg.offset} {svg.i_t_r.y-svg.offset}, {svg.t_r  .x} {svg.t_r  .y-svg.offset}, {svg.b_r  .x} {svg.b_r  .y-svg.offset}, {svg.i_b_l.x+svg.offset} {svg.i_b_l.y-svg.offset},"/>
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.i_t_l.x} {svg.i_t_l.y}, {svg.l_t  .x} {svg.l_t  .y}, {svg.r_t  .x} {svg.r_t  .y}, {svg.i_t_r.x} {svg.i_t_r.y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_r.x} {svg.i_b_r.y}, {svg.r_b  .x} {svg.r_b  .y}, {svg.l_b  .x} {svg.l_b  .y}, {svg.i_b_l.x} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
            
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
            <circle cy="{svg.c_y-svg.offset}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
			</clipPath>  
	</defs>
    <defs>
		<clipPath id="tee-dot-offset-dashed">
            <polygon points="{svg.t_l  .x} {svg.t_l  .y}, {svg.t_r  .x} {svg.t_r  .y}, {svg.b_r  .x} {svg.b_r  .y}, {svg.i_b_r.x+svg.offset} {svg.i_b_r.y}, {svg.r_b  .x+svg.offset} {svg.r_b  .y}, {svg.l_b  .x+svg.offset} {svg.l_b  .y}, {svg.i_b_l.x+svg.offset} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
            <polygon points="{svg.d_1.x2} {svg.d_1.y1}, {svg.d_1.x1} {svg.d_1.y1}, {svg.d_1.x1} {svg.d_1.y2}, {svg.d_1.x2} {svg.d_1.y2}"/>
            <polygon points="{svg.d_2.x2} {svg.d_2.y1}, {svg.d_2.x1} {svg.d_2.y1}, {svg.d_2.x1} {svg.d_2.y2}, {svg.d_2.x2} {svg.d_2.y2}"/>
            <polygon points="{svg.d_3.x2} {svg.d_3.y1}, {svg.d_3.x1} {svg.d_3.y1}, {svg.d_3.x1} {svg.d_3.y2}, {svg.d_3.x2} {svg.d_3.y2}"/>
            <polygon points="{svg.d_4.x2} {svg.d_4.y1}, {svg.d_4.x1} {svg.d_4.y1}, {svg.d_4.x1} {svg.d_4.y2}, {svg.d_4.x2} {svg.d_4.y2}"/>
            <polygon points="{svg.d_5.x2} {svg.d_5.y1}, {svg.d_5.x1} {svg.d_5.y1}, {svg.d_5.x1} {svg.d_5.y2}, {svg.d_5.x2} {svg.d_5.y2}"/>
            <circle cy="{svg.c_y}" cx="{svg.c_x}" r="{svg.c_r}" stroke="black" stroke-width="1" fill="black" />
        </clipPath>  
	</defs>
</svg>
<div class="row material-top">
	{#if (typeof(material_mapping) != "undefined"&&material_mapping!==null)}
		{#each Object.keys(material_mapping) as key, i}
				<img src={material_mapping[key].thumbnail} alt="">
		{/each}
	{/if}
</div>
<div class="row">
	<div class="base-upgrade-column">
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
		<div class="tool-cube "></div>
	</div>
	<div class="tree">	
		<div class="row">
			<div class="tool-cube "></div>
			<div class="path tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path flat-bottom-angle-dot"></div>
			<div class="tool-cube "></div>
			<div class="path flat-bottom-angle-dot"></div>
			<div class="tool-cube "></div>
			<div class="empty-tool-cube "></div>
			<div class="empty path"></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="path down"></div>
			<div class="empty path "></div>
			<div class="path down"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right"></div>
			<div class="tool-cube "></div>
			<div class="path cross-section"></div>
			<div class="path flat "></div>
			<div class="path flat-dot-dashed"></div>
			<div class="tool-cube "></div>
			<div class="path angle-left-down"></div>
			<div class="empty path "></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="path down"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-angle-bottom-flat-dot"></div>
			<div class="tool-cube "></div>
			<div class="path flat-dot-dashed"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-angle-bottom-flat-dot"></div>
			<div class="tool-cube "></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="path down"></div>
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee"></div>
			<div class="path flat "></div>
			<div class="path flat-dot-dashed"></div>
			<div class="tool-cube "></div>
			<div class="path flat-bottom-angle-dot"></div>
			<div class="tool-cube "></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-angle-bottom-flat-dot"></div>
			<div class="tool-cube "></div>
			<div class="path flat-dot-dashed"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-tee-bottom-angle-dot"></div>
			<div class="tool-cube "></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="path down"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path flat-bottom-angle-dot"></div>
			<div class="tool-cube "></div>
			<div class="path tee-dot-offset-dashed"></div>
			<div class="tool-cube "></div>
			<div class="path left-full-vertical"></div>
			<div class="empty path "></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path flat-dot"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-tee-dot"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-tee-bottom-angle-dot-dash-connect-cross-section"></div>
			<div class="tool-cube "></div>
			<div class="path down"></div>
			<div class="empty path "></div>
		</div>
		<div class="row">
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="empty-tool-cube"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-angle-bottom-flat-dot"></div>
			<div class="tool-cube "></div>
		</div>
	</div>
	<div class="description-bar">
		<div class="tool-description">
			{#if (typeof(requirements[selected_tool_index]) != "undefined"
			&& requirements[selected_tool_index]!==null)
			&& (typeof(material_mapping) != "undefined"
			&& material_mapping!==null)
			&& (thumbnails.length != 0)
			&& (descriptions.length != 0)}
				<img src={thumbnails[selected_tool_index]} alt="">
				<div>
					{#each descriptions[selected_tool_index] as desc}
						<p>{desc}</p>
					{/each}
					<div class="material">
						{#each Object.keys(requirements[selected_tool_index]) as key, j}
							{#if (Object.values(requirements[selected_tool_index])[j] != 0)}
								<div>
									<img src={material_mapping[key.toLowerCase()].thumbnail} alt="">
									<p>{Object.values(requirements[selected_tool_index])[j]}</p>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<div style="height:30px"></div>
		<div class="tool-description">
			{#if (typeof(requirements[selected_tool_index]) != "undefined"
			&& requirements[selected_tool_index]!==null)
			&& (typeof(material_mapping) != "undefined"
			&& material_mapping!==null)
			&& (thumbnails.length != 0)
			&& (descriptions.length != 0)}
				<img src={material_thumbnails[selected_material_index]} alt="">
				<div>
					{#each material_descriptions[selected_material_index] as desc}
						<p>{desc}</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	
</div>
<main>	
	<ul>
		{#each thumbnails as tool, i}
			<li class="tool">
				<img src={tool} alt="">
				<div>
					{#each descriptions[i] as desc}
						<p>{desc}</p>
					{/each}
					{#if (typeof(requirements[i]) != "undefined"&&requirements[i]!==null)&&(typeof(material_mapping) != "undefined"&&material_mapping!==null)}
					<div class="material">
						{#each Object.keys(requirements[i]) as key, j}
						{#if (Object.values(requirements[i])[j] != 0)}
						<div>
							<img src={material_mapping[key.toLowerCase()].thumbnail} alt="">
							<p>{Object.values(requirements[i])[j]}</p>
						</div>
						{/if}
						{/each}
					</div>
				{/if}
				</div>
			</li>
		{/each}
	</ul>
	<div class="material_side">
		{#if (typeof(material_mapping) != "undefined"&&material_mapping!==null)}
			{#each Object.keys(material_mapping) as key, i}
				<div >
					<img src={material_mapping[key].thumbnail} alt="">
					<p>{material_mapping[key].description}</p>
				</div>
			{/each}
		{/if}
	</div>
</main>

<style>

	@media (min-width: 640px) {
		main {
			max-width: none;
			display:flex;
			flex-direction: row;
		}	
	}
				
	.tool {
		display : flex;
		flex-direction: row;
		min-height : 100px;
		width : 600px;
		overflow: hidden;
		margin:5px;
		background-color: tan;
		padding: 15px;
		border-radius: 5px;

	}
	.tool img {
		min-height : 80px;
		min-width : 80px;
		max-height : 80px;
		max-width : 80px;
		background : grey;
		border-radius : 5px;
		margin-right : 15px;
	}
	.tool p {
		padding-left: 5px;
		padding-right: 5px;
		text-align: left;
		max-width: 480px;
		margin: 0px;
		margin-right: 15px;
		background: repeating-linear-gradient(
			tan, tan 2px, grey 2px, grey 3px, rgba(128, 128, 128, 0.5) 3px, rgba(128, 128, 128, 0.5) 19px, grey 19px, grey 20px, tan 20px, tan 22px);
	}

	.tool div {
		margin: 0px;
		padding: 0px;
	}
	.base-upgrade-column {
		display : flex;
		flex-direction: column;
		min-height : 800px;
		max-height : 800px;
		max-width : 100px;
		min-width : 100px;
		overflow-y: scroll;
		overflow-x: hidden;
		border-radius:20px;
		margin:20px;
		background: rgb(143, 117, 86);
	}

	.tool-description {
		display : flex;
		flex-direction: row;
		min-height : 300px;
		max-height : 300px;
		max-width : 400px;
		min-width : 400px;
		overflow: hidden;
		border-radius:20px;
		margin:20px;
		background: linear-gradient(to right, rgb(143, 117, 86), rgb(143, 117, 86) 105px, rgb(150, 127, 98) 105px, rgb(150, 127, 98) 600px );
		padding: 15px;
		padding-top: 50px;

	}
	.tool-description img {
		min-height : 80px;
		min-width : 80px;
		max-height : 80px;
		max-width : 80px;
		background : grey;
		border-radius : 5px;
		margin-right : 15px;
	}
	.tool-description p {
		padding-left: 5px;
		padding-right: 5px;
		text-align: left;
		max-width: 480px;
		margin: 0px;
		margin-right: 15px;
		background: repeating-linear-gradient(
			 rgb(150, 127, 98), rgb(150, 127, 98) 2px, grey 2px, grey 3px, rgba(128, 128, 128, 0.5) 3px, rgba(128, 128, 128, 0.5) 19px, grey 19px, grey 20px, rgb(150, 127, 98) 20px, rgb(150, 127, 98) 22px);
	}

	.tool-description div {
		margin: 0px;
		padding: 0px;
	}

	.material {
		display : flex;
		flex-direction: row;
		min-height : 50px;
		min-width : 50px;
		overflow: hidden;
		margin: 5px;
		background-color: transparent;
		padding: 15px;
		border-radius: 5px;

	}
	.material_descriptions {
		display : block;
	}
	.material img {
		min-height : 40px;
		min-width : 40px;
		max-height : 40px;
		max-width : 40px;
		background : grey;
		border-radius : 5px;
		margin : 5px;

	}
	.material p {
		padding-left: 5px;
		padding-right: 5px;
		text-align: left;
		margin: 0px;
		font-size: small;
		border-radius: 5px;
		border-bottom-right-radius: 18px;
		border-top-left-radius: 18px;
		background: rgba(128, 128, 128, 0.5);
		
	}

	.material div {
		margin: 0px;
		padding: 0px;
	}


	.material-top {
		min-height : 100px;
		max-width : 1550px;
		min-width : 1550px;
		overflow-x: scroll;
		overflow-y: hidden;
		margin: 20px;
		background: rgb(143, 117, 86);
		border-radius: 15px;
	}
	.material-top img {
		min-height : 80px;
		min-width : 80px;
		max-height : 80px;
		max-width : 80px;
		background : grey;
		border-radius : 15px;
		margin : 10px;
	}
	.material_side {
		display : flex;
		flex-direction: column;
		min-height : 50px;
		min-width : 50px;
		overflow: hidden;
		margin: 5px;
		margin-top: 20px;
		background: tan;
		padding: 5px;
		border-radius: 15px;
	}
	.material_side img {
		min-height : 40px;
		min-width : 40px;
		max-height : 40px;
		max-width : 40px;
		background : grey;
		border-radius : 5px;
		margin : 5px;
	}
	.material_side p {
		padding-left: 5px;
		padding-right: 5px;
		text-align: left;
		margin: 0px;
		font-size: small;
		border-radius: 5px;
		border-bottom-right-radius: 18px;
		border-top-left-radius: 18px;
		background: rgba(128, 128, 128, 0.5);
	}

	.material_side div {
		margin: 10px;
		max-height : 50px;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		transition-property: max-height;
		transition: 0.8s ease-in-out;
	}

	.material_side div:hover{
		max-height: 150px;
	}
	.row {
        display : flex;
        flex-direction: row;
    }
    .empty, .empty.path {
		background: transparent;
	}
	.empty-tool-cube {
	background: transparent;
      max-width:40px;
      min-width:40px;
	}
	.empty.path {
      max-width:100px;
      min-width:100px;
	}
    .path.flat {
      max-width:100px;
      min-width:100px;
	}
    .path {
      min-height:100px;
      max-height:100px;
      max-width:40px;
      min-width:40px;
      background:black;
	}
	.tool-cube img {
      min-height:80px;
      max-width:80px;
      max-height:80px;
	  min-width:80px;
	}
    .tool-cube {
		background: rgb(88, 88, 88);
		margin: 10px;
		min-height:80px;
		max-height:80px;
		max-width:80px;
		min-width:80px;
		border-radius: 15px;
	 
	}
	div.tree {
		min-width: 940px;
		min-height: 800px;
		max-width: 940px;
		max-height: 800px;
		border-radius:20px;
		margin:20px;
		background-image: repeating-linear-gradient(90deg, rgb(143, 117, 86), rgb(143, 117, 86) 100px,rgb(150, 127, 98) 100px, rgb(150, 127, 98) 140px);
	}
    .cross-section {
      clip-path: url(#cross-section);
    }
    .left-full-vertical {
      clip-path: url(#left-full-vertical);
    }
    .tee-dot {
      clip-path: url(#tee-dot);
    }
    .upsidedown-tee-dot {
      clip-path: url(#upsidedown-tee-dot);
    }
    .tee {
      clip-path: url(#tee);
    }
    .upsidedown-tee {
      clip-path: url(#upsidedown-tee);
    }
    .flat {
      clip-path: url(#flat);
    }
    .down {
      clip-path: url(#down);
    }
    .flat-dot {
      clip-path: url(#flat-dot);
    }
    .flat-bottom-angle-dot {
      clip-path: url(#flat-bottom-angle-dot);
    }
    .upsidedown-tee-bottom-angle-dot {
      clip-path: url(#upsidedown-tee-bottom-angle-dot);
    }
    .upsidedown-angle-bottom-flat-dot {
      clip-path: url(#upsidedown-angle-bottom-flat-dot);
    }
    .angle-top-right {
      clip-path: url(#angle-top-right);
    }
    .angle-top-right-dot {
      clip-path: url(#angle-top-right-dot);
    }
    .angle-left-down {
      clip-path: url(#angle-left-down);
    }

    .flat-dot-dashed {
      clip-path: url(#flat-dot-dashed );
    }
    .upsidedown-tee-bottom-angle-dot-dash-connect-cross-section {
      clip-path: url(#upsidedown-tee-bottom-angle-dot-dash-connect-cross-section);
    }
    .tee-dot-offset-dashed {
      clip-path: url(#tee-dot-offset-dashed );
    }
	::-webkit-scrollbar {
		display: none;
	}
</style>