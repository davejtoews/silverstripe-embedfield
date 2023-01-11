<?php

namespace nathancox\EmbedField\Model;

use SilverStripe\ORM\DataObject;
use Embed\Embed;

/**
 * Represents an oembed object.  Basically populated from oembed so the front end has quick access to properties.
 */
class EmbedObject extends DataObject {

	private static $db = array(
		'SourceURL' => 'Varchar(255)',
		'Title' => 'Varchar(255)',
		'Type' => 'Varchar(255)',
		'Version' => 'Float',

		'Width' => 'Int',
		'Height' => 'Int',

		'ThumbnailURL' => 'Varchar(355)',
		'ThumbnailWidth' => 'Int',
		'ThumbnailHeight' => 'Int',

		'ProviderURL' => 'Varchar(255)',
		'ProviderName' => 'Varchar(255)',

		'AuthorURL' => 'Varchar(255)',
		'AuthorName' => 'Varchar(255)',

		'EmbedHTML' => 'HTMLText',
		'URL' => 'Varchar(355)',
		'Origin' => 'Varchar(355)',
		'WebPage' => 'Varchar(355)'
	);

	private static $table_name='EmbedObject';

	public $updateOnSave = false;

	public $sourceExists = false;

	function sourceExists() {
		return ($this->ID != 0 || $this->sourceExists);
	}

	function updateFromURL($sourceURL = null) {
		if ($this->SourceURL) {
			$sourceURL = $this->SourceURL;
		}
		$embed = new Embed();
		$info = $embed->get($sourceURL);
		//Oembed::get_oembed_from_url($sourceURL);

		$this->updateFromObject($info);
	}

	function updateFromObject($info) {
		// Previously this line checked width. Unsure if this was just to
		// check if object was populated, or if width was of specific importence
		// Assuming the former and checking URL instead
		if ($info && $info->url) {
            $this->sourceExists = true;

			$this->Title = $info->title;

			// Several properties no longer supported. These can potentially be re-introduced
			// by writing custom detectors: https://github.com/oscarotero/Embed#detectors

            $this->Type = $info->getOEmbed()->get('type') ? (string) $info->getOEmbed()->get('type') : '';
            $this->Width = $info->getOEmbed()->get('width') ? (string) $info->getOEmbed()->get('width') : '';
            $this->Height = $info->getOEmbed()->get('height') ? (string) $info->getOEmbed()->get('height') : '';

            $this->ThumbnailURL = (string) $info->image;
			$this->ThumbnailWidth = $info->getOEmbed()->get('thumbnail_width') ? (string) $info->getOEmbed()->get('thumbnail_width') : '';
			$this->ThumbnailHeight = $info->getOEmbed()->get('thumbnail_height') ? (string) $info->getOEmbed()->get('thumbnail_height') : '';

            $this->ProviderURL = (string) $info->providerUrl;
			$this->ProviderName = $info->providerName;


			$this->AuthorURL = (string) $info->authorUrl;
			$this->AuthorName = $info->authorName;

			$embed = $info->code;
			$this->EmbedHTML = (string) $embed;
			$this->URL = (string) $info->url;
			$this->Origin = (string) $info->providerUrl;
			$this->WebPage = (string) $info->url;

		} else {
			$this->sourceExists = false;
		}
	}

	/**
	 * Return the object's properties as an array
	 * @return array
	 */
	function toArray() {
		if ($this->ID == 0) {
			return array();
		} else {

			$array = $this->toMap();
			unset($array['Created']);
			unset($array['Modified']);
			unset($array['ClassName']);
			unset($array['RecordClassName']);
			unset($array['ID']);
			unset($array['SourceURL']);

			return $array;
		}



	}

	function onBeforeWrite() {
		parent::onBeforeWrite();

		if ($this->updateOnSave === true) {
			$this->updateFromURL($this->SourceURL);
			$this->updateOnSave = false;
		}

	}


	function forTemplate() {
		if ($this->Type) {
			return $this->renderWith($this->ClassName.'_'.$this->Type);
		}
		return false;
	}

	/**
	 * This is used for making videos responsive.  It uses the video's actual dimensions to calculate the height needed for it's aspect ratio (when using this technique: http://alistapart.com/article/creating-intrinsic-ratios-for-video)
	 * @return string 	Percentage for use in CSS
	 */
	function getAspectRatioHeight() {
		return ($this->Height / $this->Width) * 100 . '%';
	}

}
