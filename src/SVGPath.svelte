<script >
    import { onMount } from 'svelte';
    import { clippaths } from './store.js';
    export let path_type='', polygons='', circles='',divClass='';
	const init_svg_values = ()=>{
        let svg = {
            line_thickness : 5,
            long_height : 100,
            long_width : 100,
            height : 100,
            width : 40,},
		    h_h = svg.height/2,
			h_w = svg.width/2,
			h_lt = svg.line_thickness/2,
			h_inc = svg.height/5;
		svg.offset= svg.line_thickness*1.5;
		svg.c_r   = svg.line_thickness;
		svg.c_x   = svg.width-svg.line_thickness;
		svg.c_y   = h_h;
		svg.t_l   = {x:0,y:h_h-h_lt};
		svg.b_l   = {x:0,y:h_h+h_lt};
		svg.t_r   = {x:svg.width,y:h_h-h_lt};
		svg.b_r   = {x:svg.width,y:h_h+h_lt};
		svg.l_t   = {x:h_w-h_lt,y:0};
		svg.r_t   = {x:h_w+h_lt,y:0};
		svg.l_b   = {x:h_w-h_lt,y:svg.height};
		svg.r_b   = {x:h_w+h_lt,y:svg.height};
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
    let svg = init_svg_values();
    let style = `<style>.${path_type} {clip-path: url(#${path_type} );}`;
    let showStyle=false;
    let polygonFromPoints = (points) => `${points.reduce((acc,cur)=>acc+`${cur.x} ${cur.y},`,'')}`
    onMount(()=>{
        let val;
        const unsubscribe = clippaths.subscribe(value => {
            val = value;
        });
        if(!val.includes(path_type)){
            clippaths.update(cur => [...cur,path_type]);
            showStyle = true;
        }
    })
</script>
<div class={`${path_type} ${divClass}`}></div>
    
{#if (showStyle)}
    {@html style}
    <svg width="0" height="0" viewBox="0 0 0 0">
        <defs>
            <clipPath id={path_type}>
                {#each polygons as poly}
                    <polygon points="{polygonFromPoints(poly.pnts).slice(0, -1)}"/>
                {/each}
                {#each circles as circ}
                    <circle cy="{circ.y}" cx="{circ.x}" r="{circ.r}" stroke="black" stroke-width="1" fill="black" />
                {/each}
            </clipPath>  
        </defs>
    </svg>
{/if}