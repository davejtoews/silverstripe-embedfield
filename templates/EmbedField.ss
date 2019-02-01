<a class='embed-thumbnail <% if ShowThumbnail %><% else %>empty<% end_if %>' target='_blank'>
<img src='$ThumbnailURL' id='{$ID}_Thumbnail' title='$ThumbnailTitle' alt='' />
</a>

<div class="fieldholder-small">
    $SourceURL
    <button 
        type="button"
        value="Add url"
        class="action ss-ui-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary"
        data-icon="add"
        role="button"
        aria-disabled="false">
        <span class="ui-button-icon-primary ui-icon btn-icon-add"></span>
        <span>Add url</span>
    </button>
</div>
<em id='{$ID}_message' class='embedfield-message'></em>

<div class='clear'></div>
