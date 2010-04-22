/* LoadFx Effects based on MooTools More addons
 *
 * Requires:
 * |-  LoadFx
 * |-  MooTools More:
 *     |-  Fx.Reveal
 */

LoadFX.addEffects({
    'reveal': {
		hide: function(el)
		{
			new Fx.Reveal(el, {duration: 0}).dissolve();
		},
		
		show: function(el)
		{
			new Fx.Reveal(el, {duration: 0}).reveal();
		},
		
		reveal: function(el)
		{
			el.reveal();
		},
		
		dissolve: function(el)
		{
			el.dissolve();
		}
	},
});
