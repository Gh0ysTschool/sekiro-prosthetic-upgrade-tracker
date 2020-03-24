<script>
	import { onMount } from 'svelte';
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
		
	});

</script>
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

	.material {
		display : flex;
		flex-direction: row;
		min-height : 50px;
		min-width : 50px;
		overflow: hidden;
		margin: 5px;
		background-color: tan;
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
</style>