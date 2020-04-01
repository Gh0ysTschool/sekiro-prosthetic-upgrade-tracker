<script>
	import { onMount } from 'svelte';
	let 
	 thumbnails = []
	,material_mapping
	,descriptions = []
	,requirements = []
	,material_thumbnails = []
	,selected_tool_index = 14
	,material_descriptions = []
	,selected_material_index = 0;
	export let tools;
	export let materials;
	export let svg = {
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
	const init_svg_values = (svg)=>{
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
	}
	init_svg_values(svg);
	
	const get_reducer = (f_ext) => {
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
						[...acc
						,fetch(cur)
							.then((res) => (f_ext==".txt") ? res.text() : res.json())
							.then((desc) => (f_ext==".txt") ? desc.trim().split("\n") : desc )
						]
					,[]
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
		requirements = await
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
		let svg_classes = ["path tee"
						,"tool-cube"
						,"path down"
						,"path flat"
						,"empty path"
						,"path tee-dot"
						,"path flat-dot"
						,"empty-tool-cube"
						,"path cross-section"
						,"path angle-top-right"
						,"path flat-dot-dashed"
						,"path angle-left-down"
						,"path flat-dot-dashed"
						,"path left-full-vertical"
						,"path upsidedown-tee-dot"
						,"path angle-top-right-dot"
						,"path flat-bottom-angle-dot"
						,"path tee-dot-offset-dashed"
						,"path upsidedown-tee-bottom-angle-dot"
						,"path upsidedown-angle-bottom-flat-dot"
						,"path upsidedown-tee-bottom-angle-dot-dash-connect-cross-section"
						];
		let tool_grid_by_class = 
			[[1,  5, 1,  5, 1,  5, 1, 16, 1, 16, 1,  7, 4]
			,[4,  2, 4,  2, 4,  9, 1,  8, 3, 10, 1, 11, 4]
			,[4,  2, 4, 15, 1,  5, 1, 19, 1, 10, 1, 19, 1]
			,[4,  2, 4,  7, 4, 15, 1,  0, 3, 10, 1, 16, 1]
			,[4, 15, 1,  5, 1,  5, 1, 19, 1, 10, 1, 18, 1]
			,[4,  7, 4,  2, 4, 15, 1, 16, 1, 17, 1, 13, 4]
			,[4,  7, 4, 15, 1,  6, 1, 14, 1, 20, 1,  2, 4]
			,[4,  7, 4,  7, 4,  7, 4,  7, 4, 15, 1, 19, 1]
			]
		let tree = document.querySelector(".tree");
		for( let i in tool_grid_by_class ) {
			let row = document.createElement("row");
			row.classList.add("row");
			for ( let j in tool_grid_by_class[i]) {
				let cube = document.createElement("div");
				let classes = svg_classes[tool_grid_by_class[i][j]].split(" ");
				for ( let c in classes ) {
					cube.classList.add(classes[c]);
				}
				row.appendChild(cube);
			}
			tree.appendChild(row);
		}
		let base_upgrade_column = document.querySelector(".base-upgrade-column");
		for ( let i = 0; i < 10; i++){
			let div = document.createElement("div");
			div.classList.add("tool-cube");
			base_upgrade_column.appendChild(div)
		}
		let tool_indexes = [0,4,7,10,14,18,21,25,31,36,40,26,32,33,34,35,27,28,1 ,19,29,20,30,22,23,24,13,5 ,11,2 ,12,3,8,38,9 ,15,37,16,6 ,39,17];
		document.querySelectorAll(".tool-cube").forEach((el,i)=>{
			let img = document.createElement("img");
			img.classList.add("tool-img"); 
			let url = thumbnails [tool_indexes[ i ] ];
			img.setAttribute('src',url);
			el.appendChild(img);
			let t_i = tool_indexes[i];
			el.addEventListener("click",(e,el)=>{
				selected_tool_index = t_i;
			})
		});
		document.querySelectorAll(".material-top img").forEach((el,i)=>{
			let t_i = i;
			el.addEventListener("click",(e,el)=>{
				selected_material_index = t_i;

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
            <polygon points="{svg.t_l .x} {svg.t_l .y}, {svg.t_r .x} {svg.t_r .y}, {svg.b_r .x} {svg.b_r .y}, {svg.b_l .x} {svg.b_l .y},"/>
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
            <polygon points="{svg.t_l .x} {svg.t_l .y}, {svg.t_r .x} {svg.t_r .y}, {svg.b_r .x} {svg.b_r .y}, {svg.i_b_r.x+svg.offset} {svg.i_b_r.y}, {svg.r_b  .x+svg.offset} {svg.r_b  .y}, {svg.l_b  .x+svg.offset} {svg.l_b  .y}, {svg.i_b_l.x+svg.offset} {svg.i_b_l.y}, {svg.b_l  .x} {svg.b_l  .y},"/>
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
	{#if (typeof(material_mapping) != "undefined" && material_mapping!==null)}
		{#each Object.keys(material_mapping) as key, i}
			<img src={material_mapping[key].thumbnail} alt="">
		{/each}
	{/if}
</div>
<div class="row">
	<div class="base-upgrade-column"></div>
	<div class="tree"></div>
	<div class="description-bar">
		{#if (typeof(requirements[selected_tool_index]) != "undefined"
		&& requirements[selected_tool_index]!==null)
		&& (typeof(material_mapping) != "undefined"
		&& material_mapping!==null)
		&& (thumbnails.length != 0)
		&& (descriptions.length != 0)}
			<div class="tool-description">
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
			</div>
			<div style="height:30px"></div>
			<div class="tool-description">
				<img src={material_thumbnails[selected_material_index]} alt="">
				<div>
					{#each material_descriptions[selected_material_index] as desc}
						<p>{desc}</p>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style></style>