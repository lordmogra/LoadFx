/* Core LoadFx Library
 *
 * Requires:
 *     LoadFx
 *     MooTools More:
 *     |-  Assets
 */
var loadFxCSSPath = 'js/loadfx.css';

LoadFx.CSS = new Asset.css(loadFxCSSPath, {id: 'LoadFxCSS'});

LoadFx.addEvent('revealcomplete', function()
{
	//remove the element from the DOM, but keep it in case we want to re-inject it.
	this.CSS = this.CSS.dispose();
});