<script>
	import { onMount } from 'svelte';
	let selected_tool_index = 2;
	export let tools;
	export let materials;
	export let thumbnails = [];
	export let descriptions = [];
	export let requirements = [];
	export let material_thumbnails = [];
	export let material_descriptions = [];
	export let material_mapping;
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
		console.log(thumbnails);
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
		console.log(material_mapping);
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
		let tool_indexes = [26,32,33,34,35,27,28,1 ,19,29,20,30,22,23,24,13,5 ,11,2 ,12,3,8,38,9 ,15,37,16,6 ,39,17];
		document.querySelectorAll(".tool-cube").forEach((el,i)=>{
			if (i==0) return;
			let img = document.createElement("img");
			img.classList.add("tool-img"); 
			let url = thumbnails[tool_indexes[i-1]];
			img.setAttribute('src',url);
			el.appendChild(img);
			let t_i = tool_indexes[i-1];
			el.addEventListener("click",(e,el)=>{
				selected_tool_index=t_i;

			})
		});
		
	});

</script>
<svg width="0" height="0" viewBox="0 0 100 100">
	<defs>
		<clipPath id="cross-section">
			<polygon points="0 40, 40 40, 40 0, 60 0, 60 40, 100 40, 100 60, 60 60, 60 100, 40 100, 40 60,0 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="left-full-vertical">
			<polygon points="0 40, 40 40, 40 0, 60 0,  60 100, 40 100, 40 60,0 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="tee-dot">
			<polygon points="0 40, 100 40, 100 60, 60 60, 60 100, 40 100, 40 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="upsidedown-tee-dot">
			<polygon points="0 40, 40 40, 40 0, 60 0, 60 40, 100 40, 100 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="upsidedown-tee">
			<polygon points="0 40, 40 40, 40 0, 60 0, 60 40, 100 40, 100 60, 0 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="tee">
			<polygon points="0 40, 100 40, 100 60, 60 60, 60 100, 40 100, 40 60, 0 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat">
			<polygon points="0 40, 100 40, 100 60, 0 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="down">
			<polygon points="40 0, 60 0, 60 100, 40 100"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat-dot">
			<polygon points="0 40, 100 40, 100 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat-bottom-angle-dot">
			<polygon points="0 40, 100 40, 100 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
			<polygon points="40 70, 100 70, 100 90, 60 90, 60 100, 40 100"/>
			<circle cy="80" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="upsidedown-tee-bottom-angle-dot">
			<polygon points="0 40, 40 40, 40 0, 60 0, 60 40, 100 40, 100 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
			<polygon points="40 70, 100 70, 100 90, 60 90, 60 100, 40 100"/>
			<circle cy="80" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="upsidedown-angle-bottom-flat-dot">
			<polygon points="40 0, 60 0, 60 10, 100 10, 100 30, 40 30"/>
			<circle cy="20" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
			<polygon points="0 40, 100 40,100 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="angle-top-right">
			<polygon points="40 0, 60 0, 60 40, 100 40, 100 60, 40 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="angle-top-right-dot">
			<polygon points="40 0, 60 0, 60 40, 100 40, 100 60, 40 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="angle-left-down">
			<polygon points="0 40,60 40, 60 100, 40 100, 40 60, 0 60"/>
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="flat-dot-dashed">
			<polygon points="0 40, 100 40, 100 60, 0 60"/>
			<polygon points="45 0, 55 0, 55 10, 45 10"/>
			<polygon points="45 20, 55 20, 55 30, 45 30"/>
			<polygon points="45 40, 55 40, 55 50, 45 50"/>
			<polygon points="45 60, 55 60, 55 70, 45 70"/>
			<polygon points="45 80, 55 80, 55 90, 45 90"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="upsidedown-tee-bottom-angle-dot-dash-connect-cross-section">
			<polygon points="70 0, 90 0, 90 10, 100 10, 100 30, 70 30"/>
			<circle cy="20" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
			<polygon points="0 40, 40 40, 40 0, 60 0, 60 40, 100 40,100 60, 60 60, 60 100, 40 100, 40 60, 0 60"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
	<defs>
		<clipPath id="tee-dot-offset-dashed">
			<polygon points="0 40, 100 40, 100 60, 90 60, 90 100, 70 100, 70 60, 0 60"/>
			<polygon points="45 0, 55 0, 55 10, 45 10"/>
			<polygon points="45 20, 55 20, 55 30, 45 30"/>
			<polygon points="45 40, 55 40, 55 50, 45 50"/>
			<polygon points="45 60, 55 60, 55 70, 45 70"/>
			<polygon points="45 80, 55 80, 55 90, 45 90"/>
			<circle cy="50" cx="85" r="15" stroke="black" stroke-width="1" fill="black" />
		</clipPath>  
	</defs>
</svg>
<div class="row">
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
			<div class="empty path"></div>
			<div class="empty path "></div>
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
			<div class="empty path"></div>
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
			<div class="empty path"></div>
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
			<div class="empty path"></div>
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
			<div class="empty path"></div>
			<div class="empty path "></div>
			<div class="empty path"></div>
			<div class="empty path "></div>
			<div class="empty path"></div>
			<div class="empty path "></div>
			<div class="empty path"></div>
			<div class="empty path "></div>
			<div class="path angle-top-right-dot"></div>
			<div class="tool-cube "></div>
			<div class="path upsidedown-angle-bottom-flat-dot"></div>
			<div class="tool-cube "></div>
		</div>
	</div>
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
			{/each}<div class="material">
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
	.tool-description {
		display : flex;
		flex-direction: row;
		min-height : 300px;
		max-height : 300px;
		max-width : 600px;
		min-width : 600px;
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
    .path {
      min-height:100px;
      max-height:100px;
      max-width:100px;
      min-width:100px;
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
		min-width: 1300px;
		min-height: 800px;
		max-width: 1300px;
		max-height: 800px;
		border-radius:20px;
		margin:20px;
		background-image: repeating-linear-gradient(90deg, rgb(143, 117, 86), rgb(143, 117, 86) 100px,rgb(150, 127, 98) 100px, rgb(150, 127, 98) 200px);
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
</style>