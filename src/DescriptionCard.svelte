<script>
    import { onMount } from 'svelte';
    export let thumbnailUrl, description=[], subThumbnailUrls=[], labels;
</script>
<div class="tool-description">
    <img src={thumbnailUrl} alt="">
    <div>
        {#each description as line}
            <p>{line}</p>
        {/each}
        <div class="material">
            {#each subThumbnailUrls as thumb, i}
                <div>
                    <img src={thumb} alt="">
                    <p>{labels[i]}</p>
                </div>
            {/each}
        </div>
    </div> 
</div>
<style>
    .tool-description img {
        margin: 10px;
        margin-top:0px;
        background: var(--tool-bg);
        border-radius: 15px;
        margin-right: 15px;
        min-height : var(--large-thumbnail-size);
        max-width  : var(--large-thumbnail-size);
        max-height : var(--large-thumbnail-size);
        min-width  : var(--large-thumbnail-size);
    }
    .tool-description p {
        margin: 0px;
        max-width: 800px;
        text-align: left;
        padding-left: 5px;
        margin-right: 15px;
        padding-right: 5px;
        background: repeating-linear-gradient( rgb(150, 127, 98), rgb(150, 127, 98) 2px, grey 2px, grey 3px, rgba(128, 128, 128, 0.5) 3px, rgba(128, 128, 128, 0.5) 19px, grey 19px, grey 20px, rgb(150, 127, 98) 20px, rgb(150, 127, 98) 22px);
    }
    .tool-description {
        padding-top:10px;
        margin-top: 15px;
        display: flex;
        max-width: 92vw;
        min-width: 92vw;
        overflow: hidden;
        min-height: 220px;
        max-height: 220px;
        border-radius: 20px;
        flex-direction: row;
        background: linear-gradient(to right, rgb(143, 117, 86), rgb(143, 117, 86) 220px, rgb(150, 127, 98) 220px, rgb(150, 127, 98) 600px); 
    }
    .tool-description div {
        overflow-y: scroll;
    }
    .material img {
        background: grey;
        border-radius: 0px;
        border-top-left-radius: 15px;
        border-bottom-right-radius: 15px;
        margin: 5px;
        min-height : var(--small-thumbnail-size);
        max-width  : var(--small-thumbnail-size);
        max-height : var(--small-thumbnail-size);
        min-width  : var(--small-thumbnail-size);
    }
    .material p {
        background: grey;
        text-align: center;
    }
</style>