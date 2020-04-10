
<script>
    import  GridWithSVGPaths  from './GridWithSVGPaths.svelte';
    import  DescriptionBar  from './DescriptionBar.svelte';
    import { onMount } from 'svelte';
    export let tools, materials, selectedTool, selectedMaterial;
    function formatPathAll(pathArrays){
        return pathArrays.reduce((acc,cur)=>[...acc,formatPath(...cur)],[]);}
    function formatPath(path_type,polygons,circles){
        return {'path_type':path_type,'polygons':polygons,'circles':circles};}
    function getPathDefinitions(svgInfo){
        let s = svgInfo;
        return formatPathAll([
            ['tee',[{pnts:[s.t_l, s.t_r, s.b_r, s.i_b_r, s.r_b, s.l_b, s.i_b_l, s.b_l, s.t_l]}],[]],
            ['tool-cube',[],[]],
            ['down',[{pnts:[s.l_t, s.r_t, s.r_b, s.l_b, s.l_t]}],[]],
            ['flat',[{pnts:[s.t_l_l, s.t_r_l, s.b_r_l, s.b_l_l, s.t_l_l]}],[]],
            ['empty',[],[]],
            ['tee-dot',[{pnts:[s.t_l, s.t_r, s.b_r, s.i_b_r, s.r_b, s.l_b, s.i_b_l, s.b_l, s.t_l]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['flat-dot',[{pnts:[s.t_l_l, s.t_r_l, s.b_r_l, s.b_l_l, s.t_l_l]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['empty-tool-cube',[],[]],
            ['cross-section',[{pnts:[s.t_l, s.i_t_l, s.l_t, s.r_t, s.i_t_r, s.t_r, s.b_r, s.i_b_r, s.r_b, s.l_b, s.i_b_l, s.b_l, s.t_l]}],[]],
            ['angle-top-right',[{pnts:[s.l_t, s.r_t, s.i_t_r, s.t_r, s.b_r, s.i_b_l, s.l_t]}],[]],
            ['flat-dot-dashed',[{pnts:[s.t_l_l, s.t_r_l, s.b_r_l, s.b_l_l, s.t_l_l]},{pnts:[{x:s.d_1.x2,y:s.d_1.y1}, {x:s.d_1.x1,y:s.d_1.y1}, {x:s.d_1.x1,y:s.d_1.y2}, {x:s.d_1.x2,y:s.d_1.y2}]},{pnts:[{x:s.d_2.x2,y:s.d_2.y1}, {x:s.d_2.x1,y:s.d_2.y1}, {x:s.d_2.x1,y:s.d_2.y2}, {x:s.d_2.x2,y:s.d_2.y2}]},{pnts:[{x:s.d_3.x2,y:s.d_3.y1}, {x:s.d_3.x1,y:s.d_3.y1}, {x:s.d_3.x1,y:s.d_3.y2}, {x:s.d_3.x2,y:s.d_3.y2}]},{pnts:[{x:s.d_4.x2,y:s.d_4.y1}, {x:s.d_4.x1,y:s.d_4.y1}, {x:s.d_4.x1,y:s.d_4.y2}, {x:s.d_4.x2,y:s.d_4.y2}]},{pnts:[{x:s.d_5.x2,y:s.d_5.y1}, {x:s.d_5.x1,y:s.d_5.y1}, {x:s.d_5.x1,y:s.d_5.y2}, {x:s.d_5.x2,y:s.d_5.y2}]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['angle-left-down',[{pnts:[s.t_l, s.i_t_r, s.r_b, s.l_b, s.i_b_l, s.b_l, s.t_l]}],[]],
            /*duplicate*/['flat-dot-dashed',[{pnts:[s.t_l_l, s.t_r_l, s.b_r_l, s.b_l_l, s.t_l_l]},{pnts:[{x:s.d_1.x2,y:s.d_1.y1}, {x:s.d_1.x1,y:s.d_1.y1}, {x:s.d_1.x1,y:s.d_1.y2}, {x:s.d_1.x2,y:s.d_1.y2}]},{pnts:[{x:s.d_2.x2,y:s.d_2.y1}, {x:s.d_2.x1,y:s.d_2.y1}, {x:s.d_2.x1,y:s.d_2.y2}, {x:s.d_2.x2,y:s.d_2.y2}]},{pnts:[{x:s.d_3.x2,y:s.d_3.y1}, {x:s.d_3.x1,y:s.d_3.y1}, {x:s.d_3.x1,y:s.d_3.y2}, {x:s.d_3.x2,y:s.d_3.y2}]},{pnts:[{x:s.d_4.x2,y:s.d_4.y1}, {x:s.d_4.x1,y:s.d_4.y1}, {x:s.d_4.x1,y:s.d_4.y2}, {x:s.d_4.x2,y:s.d_4.y2}]},{pnts:[{x:s.d_5.x2,y:s.d_5.y1}, {x:s.d_5.x1,y:s.d_5.y1}, {x:s.d_5.x1,y:s.d_5.y2}, {x:s.d_5.x2,y:s.d_5.y2}]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['left-full-vertical',[{pnts:[s.t_l, s.i_t_l, s.l_t, s.r_t, s.r_b, s.l_b, s.i_b_l, s.b_l, s.t_l]}],[]],
            ['upsidedown-tee-dot',[{pnts:[s.t_l, s.i_t_l, s.l_t, s.r_t, s.i_t_r, s.t_r, s.b_r, s.b_l, s.t_l]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['angle-top-right-dot',[{pnts:[s.l_t, s.r_t, s.i_t_r, s.t_r, s.b_r, s.i_b_l, s.l_t]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['flat-bottom-angle-dot',[{pnts:[{x:s.i_t_l.x, y:s.i_t_l.y+s.offset}, {x:s.t_r.x, y:s.t_r.y+s.offset}, {x:s.b_r.x,y:s.b_r.y+s.offset}, {x:s.i_b_r.x,y:s.i_b_r.y+s.offset}, s.r_b, s.l_b, {x:s.i_t_l.x, y:s.i_t_l.y+s.offset}]},{pnts:[s.t_l, s.t_r, s.b_r, s.b_l, s.t_l]}],[{y:s.c_y,x:s.c_x,r:s.c_r,},{y:s.c_y+s.offset,x:s.c_x,r:s.c_r,}]],
            ['tee-dot-offset-dashed',[{pnts:[s.t_l, s.t_r, s.b_r, {x:s.i_b_r.x+s.offset,y:s.i_b_r.y}, {x:s.r_b.x+s.offset,y:s.r_b.y}, {x:s.l_b.x+s.offset,y:s.l_b.y}, {x:s.i_b_l.x+s.offset,y:s.i_b_l.y}, s.b_l, s.t_l]},{pnts:[{x:s.d_1.x2,y:s.d_1.y1}, {x:s.d_1.x1,y:s.d_1.y1}, {x:s.d_1.x1,y:s.d_1.y2}, {x:s.d_1.x2,y:s.d_1.y2}]},{pnts:[{x:s.d_2.x2,y:s.d_2.y1}, {x:s.d_2.x1,y:s.d_2.y1}, {x:s.d_2.x1,y:s.d_2.y2}, {x:s.d_2.x2,y:s.d_2.y2}]},{pnts:[{x:s.d_3.x2,y:s.d_3.y1}, {x:s.d_3.x1,y:s.d_3.y1}, {x:s.d_3.x1,y:s.d_3.y2}, {x:s.d_3.x2,y:s.d_3.y2}]},{pnts:[{x:s.d_4.x2,y:s.d_4.y1}, {x:s.d_4.x1,y:s.d_4.y1}, {x:s.d_4.x1,y:s.d_4.y2}, {x:s.d_4.x2,y:s.d_4.y2}]},{pnts:[{x:s.d_5.x2,y:s.d_5.y1}, {x:s.d_5.x1,y:s.d_5.y1}, {x:s.d_5.x1,y:s.d_5.y2}, {x:s.d_5.x2,y:s.d_5.y2}]}],[{y:s.c_y,x:s.c_x,r:s.c_r,}]],
            ['upsidedown-tee-bottom-angle-dot',[{pnts:[s.t_l, s.i_t_l, s.l_t, s.r_t, s.i_t_r, s.t_r, s.b_r, s.b_l, s.t_l]},{pnts:[{x:s.i_t_l.x, y:s.i_t_l.y+s.offset}, {x:s.t_r.x, y:s.t_r.y+s.offset}, {x:s.b_r.x,y:s.b_r.y+s.offset}, {x:s.i_b_r.x,y:s.i_b_r.y+s.offset}, s.r_b, s.l_b, {x:s.i_t_l.x, y:s.i_t_l.y+s.offset}]}],[{y:s.c_y,x:s.c_x,r:s.c_r,},{y:s.c_y+s.offset,x:s.c_x,r:s.c_r,}]],
            ['upsidedown-angle-bottom-flat-dot',[{pnts:[s.l_t, s.r_t, {x:s.i_t_r.x,y:s.i_t_r.y-s.offset},  {x:s.t_r.x,y:s.t_r.y-s.offset}, {x:s.b_r.x,y:s.b_r.y-s.offset}, {x:s.i_b_l.x,y:s.i_b_l.y-s.offset}, s.l_t]},{pnts:[s.t_l, s.t_r, s.b_r, s.b_l, s.t_l]}],[{y:s.c_y,x:s.c_x,r:s.c_r,},{y:s.c_y-s.offset,x:s.c_x,r:s.c_r,}]],
            ['upsidedown-tee-bottom-angle-dot-dash-connect-cross-section',[{pnts:[s.t_l, s.i_t_l, s.l_t, s.r_t, s.i_t_r, s.t_r, s.b_r, s.i_b_r, s.r_b, s.l_b, s.i_b_l, s.b_l, s.t_l]},{pnts:[{x:s.l_t.x+s.offset,y:s.l_t.y}, {x:s.r_t.x+s.offset,y:s.r_t.y}, {x:s.i_t_r.x+s.offset,y:s.i_t_r.y-s.offset}, {x:s.t_r.x,y:s.t_r.y-s.offset}, {x:s.b_r.x,y:s.b_r.y-s.offset}, {x:s.i_b_l.x+s.offset,y:s.i_b_l.y-s.offset}]}],[{y:s.c_y,x:s.c_x,r:s.c_r,},{y:s.c_y-s.offset,x:s.c_x,r:s.c_r,}]],
        ]);}
    function hydratePathIndexArray(arr,paths){
        return arr.reduce((acc,cur)=>[...acc,paths[cur]],[])}
    function getPaths(){
        return hydratePathIndexArray(getPathsByClass(),getPathDefinitions(getSvgInfo()));}
    function getSvgInfo(){
        let vh = window.innerHeight,vw = window.innerWidth;
        let svg = {
                line_thickness : 5,
                long_height : vw*.10,//100,
                long_width : vw*.10,//100,
                height : vw*.10,//100,
                width : vw*.04,//40,
            }, 
            h_h = svg.height/2,
            h_w = svg.width/2,
            h_lt = svg.line_thickness/2,
            h_inc = svg.height/5;
            
		svg.offset = svg.line_thickness*1.5;
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
        return svg;}
    function getGridImagePathComposition(){
        return  [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]
                ,[0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1]
                ,[0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                ,[0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0]
                ,[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                ,[0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]
                ,[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]
                ,[0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0]
                ];}
    function getPathsByClass(){
        return [ 5, 5, 5,16,16, 7, 4,
                 /*4,*/ 2, 4, 2, 4, 9, 8, 3,10,11, 4,
                 /*4,*/ 2, 4,15, 5,19,10,19, 
                 /*4,*/ 2, 4, 7, 4,15, 0, 3,10,16,
                 /*4,*/15, 5, 5,19,10,18, 
                 /*4,*/ 7, /*4,*/ 2, 4,15,16,17,13, 
                 /*4,*/ 4, 7, /*4,*/ 15, 6,14,20, 2, 
                 /*4,*/ 4, 7, 4, 7, 4, 7, 4,  7, 15,19,];}
    function resolveToText(txt) {
        return fetch(txt).then((res) => res.text()).then((desc) => desc.trim().split("\n") )}
    function resolveToTextAll(arr){
        return Promise.all(arr.reduce((acc,cur) => [...acc,resolveToText(cur)],[]));}
    function appendExtension(arr,ext,dir){
        function getReducer(f_ext,dir){
            function getSubReducer (type){
                return (acc, cur) => [...acc,`./${dir}/${(type!='') ? type+'/' : ''}${cur}${f_ext}`];
            }
            if(dir=="tools") return (acc, cur) => [...acc,cur.tools.reduce(getSubReducer(cur.type),[])];
            return getSubReducer('');
        }
        return arr.reduce(getReducer(ext,dir),[]).join().split(',');}
    async function fetchToolDescriptions(){
        return await resolveToTextAll(appendExtension(tools,".txt","tools"));}
    async function fetchMaterialDescriptions(){
        return await resolveToTextAll(appendExtension(materials,".txt","materials"));}
    function getImageUrls(){
        return [...appendExtension(tools,".png","tools"),...appendExtension(materials,".png","materials")];}
    function getMaterialImgUrls(){
        return appendExtension(materials,".png","materials");}
    function resolveToJson(json){
        return fetch(json)
            .then((res) => res.text())
            .then((txt) => txt.trim().replace(/\n/g,''))
            .then((txt) => JSON.parse(txt));}
    function resolveToJsonAll(arr){
        return Promise.all(arr.reduce((acc,cur) => [...acc,resolveToJson(cur)],[]));}
    async function fetchRequirements(){
        return await resolveToJsonAll(appendExtension(tools,".req","tools"));}
    
    
    function setOnClickListeners(){
        function queryAndSetCubes(selector,type,indexTranslation=false){
            document.querySelectorAll(selector).forEach((el,i)=>{  
                let t_i = (indexTranslation) ? indexTranslation[i] : i;
                el.onclick=(e)=>setSelection(type,t_i);
            });
        }
        queryAndSetCubes(".tool-cube","tool",getToolDisplayOrder());
        queryAndSetCubes(".material-top img","material");}
    function setSelection(type,index){
        if (type=="tool") {selectedTool.set(index);}
        else if (type=="material"){selectedMaterial.set(index);}}
    function reorderArr(arr,order){
        return order.reduce((acc,cur)=>[...acc,arr[cur]],[])}
    function getOrderedToolImgs(arr){
        return reorderArr(getImageUrls(),getToolDisplayOrder())}
    function getToolDisplayOrder(){
        return [// BASE UPGRADE INDEXES 0, 4, 7,10,14,18,21,25,31,36,
                40,26,32,33,34,35,
                36,27,28,
                 0, 1,19,29,20,30,
                 4,22,23,24,
                 7,13, 5,11, 2,12,3,
                10,31, 8,38, 9,
                14,25,15,37,16, 6,
                18,21,39,17];}
    let gridParams = {
            gridImagePathComposition:getGridImagePathComposition(),
            gridImages:getOrderedToolImgs(),
            gridPaths:getPaths(),
            imgClass:'tool-cube',
            pathClass:'path', 
        };
    //BIG MESS RIGHT HERE
    let materialMapping = [];
    let descBarParams = getDescBarParams();
    async function getDescBarParams(){
        let f = await fetchRequirements()
        let r = await fetchToolDescriptions();
        let l = await fetchMaterialDescriptions();
        let m = f.reduce((acc,cur)=>[...acc,Object.keys(cur)],[]);
        function applyTemplate(str){
            return `./materials/${str.toLowerCase().replace(/ /g,'_')}.png`
        }
        m = m.reduce((acc,cur)=>
        [...acc,cur.reduce((acc,cur)=>[...acc,applyTemplate(cur)],[])
        ],[]);
        let temp = [];
        for (let i in m){
            for (let j in m[i]){
                if (!temp.includes(m[i][j])) {temp.push(m[i][j]);}
            }
        }
        materialMapping = temp;// m.reduce((acc,cur)=>{cur.reduce((a,c)=>{if(!acc.includes(c)) acc.push(c);});return acc;},[])
        window.requestAnimationFrame(setOnClickListeners);
        return {cards:[
            {storeSelector:selectedTool,
                thumbnailUrls:getImageUrls(),
                descriptionUrls:r,
                labels:f.reduce((acc,cur)=>[...acc,Object.values(cur)],[]),
                subThumbnailUrls:m,},
            {storeSelector:selectedMaterial,
                thumbnailUrls:getMaterialImgUrls(),
                descriptionUrls:l,
                labels:[],
                subThumbnailUrls:[],},
        ],};

    }
    onMount(()=>{
        setOnClickListeners();
    });
</script>
<div class="tree">
    <GridWithSVGPaths {...gridParams}/>
</div>
<div class="row material-top" >
    {#each materialMapping as url}
        <img src={url} alt="">
    {/each}
</div>
{#await descBarParams}
	<p>...waiting</p>
{:then params}
    <DescriptionBar {...params} />
{/await}