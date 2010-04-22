/* LoadFx Effects based on MooTools Core only
 *
 * Requires:
 * |-  LoadFx
 * |-  MooTools Core:
 *     |-  Fx.Tween
 *     |-  Fx.Morph
 */

LoadFX.addEffects({
    'fade': 
	{
		hide: function(el)
		{
			el.fade("hide");
		},
		
		show: function(el)
		{
			el.fade("show");
		},
		
		reveal: function(el)
		{
			el.fade("in");
		},
		
		dissolve: function(el)
		{
			el.fade("out");
		}
	},
	
	'fold': 
	{
		hide: function(el)
		{
			var loadfx_fold_initials = {
				'height': el.getStyle('height').toInt(),
				'width': el.getStyle('width').toInt(),
				'opacity': el.get('opacity'),
				'visibility': el.getStyle('visibility')
			};
			el.store('loadfx-fold-initials', loadfx_fold_initials);
			
			el.setStyles({
				'height': loadfx_fold_initials['height']/2,
				'width': loadfx_fold_initials['width']/2,
				'opacity': 0,
				'visiblity': 'hidden'
			});
            el.getChildren().set('opacity', 0);
		},
		
		show: function(el)
		{
			var loadfx_fold_initials = el.retrieve('loadfx-fold-initials');

			el.setStyles(loadfx_fold_initials);
            el.getChildren().set('opacity', 1).erase('style');
			el.erase('style');
			el.eliminate('loadfx-fold-initials');
		},
		
		reveal: function(el)
		{
			var loadfx_fold_initials = el.retrieve('loadfx-fold-initials');
			
			var t = new Fx.Tween(el, {link: 'chain', duration: 200});
			
			t.start('opacity', loadfx_fold_initials['opacity'])
			 .start('height', el.getStyle('height').toInt()*2)
			 .start('width', el.getStyle('width').toInt()*2)
			 .chain(function()
			{
				el.getChildren().each(function (c)
                {
                    c.get('tween', {duration: 100})
                    .start('opacity', 1);
                });
				
				el.erase('style');
				el.eliminate('loadfx-fold-initials');
			});
		},
		
		dissolve: function(el)
		{
			var loadfx_fold_initials = {
				'height': el.getStyle('height').toInt(),
				'width': el.getStyle('width').toInt(),
				'opacity': el.get('opacity'),
				'visibility': el.getStyle('visibility')
			};
			el.store('loadfx-fold-initials', loadfx_fold_initials);
			
            el.getChildren().each(function (c)
            {
                c.get('tween', {duration: 100})
                .start('opacity', 0);
            });

            (function()
             {
                var t = new Fx.Tween(el, {link: 'chain', duration: 200});
                
                t.start('width', el.getStyle('width').toInt()/2)
                 .start('height', el.getStyle('height').toInt()/2)
                 .start('opacity', 0);
             }).delay(100);
		}
	}
});
