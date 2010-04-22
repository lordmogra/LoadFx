/* Core LoadFx Library
 *
 * Requires:
 *     MooTools Core:
 *     |-  Class.Extras
 *     |-  Selectors
 */

var LoadFX = new Class({
    Implements: [Options, Events],
	
	options: {
		selector: '.loadfx-{effect}',
		onShowStart: $empty,
		onShowComplete: $empty,
		onHideStart: $empty,
		onHideComplete: $empty,
		onRevealStart: $empty,
		onRevealEnd: $empty,
		onDissolveStart: $empty,
		onDissolveEnd: $empty
	},
	
	initialize: function(options)
	{
		this.setOptions(options);
		
		this.effects = $H();
		this.selector = this.options.selector;
		this.status = null;
		
		this.addEvent('showstart',        function() { this.status = 'showing'; }, true);
		this.addEvent('showcomplete',     function() { this.status = 'shown';   }, true);
		this.addEvent('hidestart',        function() { this.status = 'hiding';  }, true);
		this.addEvent('hidecomplete',     function() { this.status = 'hidden';  }, true);
		this.addEvent('revealstart',      function() { this.status = 'showing'; }, true);
		this.addEvent('revealcomplete',   function() { this.status = 'shown';   }, true);
		this.addEvent('dissolvestart',    function() { this.status = 'hiding';  }, true);
		this.addEvent('dissolvecomplete', function() { this.status = 'hidden';  }, true);
	},
	
	getAllElements: function()
	{
		var result = new Array();
		
		this.effects.getValues().each(function(effect)
		{
			result.combine(effect.elements);
		});
		
		return result;
	},
	
	show: function(A, options)
	{
		//if not given a top element to work inside,
		//define as the body of the document.
		if (!$type(A))
			A = $(document.body);
		
		if ($type(options) != 'object')
			options = {};
		
		options = $merge({
			effects: []
		}, options);
		
		options.effects = $splat(options.effects);
			
		var self = this;
		
		self.fireEvent('showstart');
		
		LoadFX.Effects.each(function(effect, name)
		{
			var els = A.getElements(self.selector.substitute({'effect': name}));
			if ($type(els) == 'array' && els.length > 0)
			{
				els.each(effect.show);
				effect.elements = els;
				self.effects.set(name, effect);
			}
		});
		
		self.fireEvent('showcomplete');
	},
	
	hide: function(A, options)
	{
		//if not given a top element to work inside,
		//define as the body of the document.
		if (!$type(A))
			A = $(document.body);
		
		if ($type(options) != 'object')
			options = {};
			
		options = $merge({
			effects: []
		}, options);
		
		options.effects = $splat(options.effects);
			
		var self = this;
		
		self.fireEvent('hidestart');
		
		LoadFX.Effects.each(function(effect, name)
		{
			var els = A.getElements(self.selector.substitute({'effect': name}));
			if ($type(els) == 'array' && els.length > 0)
			{
				els.each(effect.hide);
				effect.elements = els;
				self.effects.set(name, effect);
			}
		});
		
		self.fireEvent('hidecomplete');
	},
	
	reveal: function(options)
	{
		if ($type(options) != 'object')
			options = {};
		
		options = $merge({
			randomize: false,
			delay: 0,
			effects: []
		}, options);
			
		options.effects = $splat(options.effects);
		
		var self = this;
		
		self.fireEvent('revealstart');
		
		var i = 0;
		
		self.effects.each(function(effect, name)
		{
			if (options.effects.length > 0 && !options.effects.contains(name))
				return;
			
			while (effect.elements.length > 0)
			{
				if (options.randomize)
					el = effect.elements.getRandom();
				else
					el = effect.elements[0];
					
				effect.reveal.delay(options.delay * self.getAllElements().length, effect, [el]);
				
				effect.elements.erase(el);
				
				i++;
			}
		});
		
		//Fire RevealComplete after all animations are done.
		self.fireEvent.delay( i * options.delay + 600, self, 'revealcomplete');
	},
	
	dissolve: function(A, options)
	{
		//if not given a top element to work inside,
		//define as the body of the document.
		if (!$type(A))
			A = $(document.body);
			
		if ($type(options) != 'object')
			options = {};
		
		options = $merge({
			randomize: false,
			delay: 0,
			effects: []
		}, options);
			
		options.effects = $splat(options.effects);
		
		var self = this;
		
		self.fireEvent('dissolvestart');
		
		var i = 0;
		
		LoadFX.Effects.each(function(effect, name)
		{
			if (options.effects.length > 0 && !options.effects.contains(name))
				return;
				
			var els = A.getElements(self.selector.substitute({'effect': name}));
			
			effect.elements = els;
			self.effects.set(name,effect);
			
			while (els.length > 0)
			{
				if (options.randomize)
					el = els.getRandom();
				else
					el = els[0];
					
				effect.dissolve.delay(options.delay * self.getAllElements().length, effect, [el]);
				
				els.erase(el);
				
				i++;
			}
		});
		
		//Fire RevealComplete after all animations are done.
		self.fireEvent.delay( i * options.delay + 600, self, 'dissolvecomplete');
	},
});

LoadFX.Effect = new Class({
	Implements: Options,
	
	options:
	{
		hide: $empty,
		show: $empty,
		reveal: $empty,
		dissolve: $empty,
	},
	
	initialize: function(options)
	{
		this.setOptions(options);
		
		this.hide = this.options.hide;
		this.show = this.options.show;
		this.reveal = this.options.reveal;
		this.dissolve = this.options.dissolve;
		
		elements = new Array();
	},
	
	elements: null,
});

LoadFX.Effects = $H();

LoadFX.addEffect = function (name, options)
{
	LoadFX.Effects.set(name, new LoadFX.Effect(options));
};
LoadFX.addEffects = function (args)
{
	$H(args).each(function(options, name) { LoadFX.addEffect(name, options);});
};

var LoadFx = new LoadFX();