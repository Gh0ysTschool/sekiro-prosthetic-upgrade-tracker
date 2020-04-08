<script >
    import  SVGPath  from './SVGPath.svelte';
    export let gridImages, gridPaths, gridImagePathComposition, imgClass='', pathClass='';
    
    let img = gridImages.values();
    let path = gridPaths.values();
</script>
{#each gridImagePathComposition as row}
    <div class='row'>
        {#each row as imgOrPath,i}
            {#if (imgOrPath==0)}
                <img src={img.next().value} alt='' class={imgClass + ((i%2==0) ? " odd" : " even")}/>
            {:else}
                <SVGPath {...(path.next().value)} divClass={pathClass + ((i%2==0) ? " odd" : " even")}/>
            {/if}
        {/each}
    </div>
{/each}