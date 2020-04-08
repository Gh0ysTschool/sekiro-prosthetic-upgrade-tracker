<script>
    import { onMount } from 'svelte';
    import DescriptionCard from './DescriptionCard.svelte';
    export let cards=[];
    //  = [{
    //     storeSelector:{subscribe:(e)=>{e}},
    //     thumbnailUrls:[],
    //     descriptionUrls:[],
    //     labels:[],
    //     subthumbnailUrls:[],
    // }];
    onMount(()=>{
        cards.forEach((card)=>{
            selectorIndexes.push(0);
            let index = selectorIndexes.length-1;
            card.storeSelector.subscribe(value => {
                selectorIndexes[index] = value;
                cards = cards;
            });
        })
    });
    let selectorIndexes = [];
    function getCardParams(card,i){
        return {
            thumbnailUrl:(i>=card.thumbnailUrls.length) ? '' : card.thumbnailUrls[i], 
            description:(i>=card.descriptionUrls.length) ? [] : card.descriptionUrls[i], 
            subThumbnailUrls:(i>=card.subThumbnailUrls.length) ? [] : card.subThumbnailUrls[i], 
            labels:(i>=card.labels.length) ? [] : card.labels[i],
        };}
</script>
<div class="description-bar column">
    {#each cards as card,i}
        <DescriptionCard {...getCardParams(card,selectorIndexes[i])}/>
    {/each}
</div>
