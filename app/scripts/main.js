/////////////////////
// READER A HTML5 FILE-READER
// SUPPORTED FILETYPES: .txt
////////////////////////


var reader = {

	text:'',
	currentChar:0,
	_this:this,
	updater:undefined,
	readSpeed:200,
	currentFile:undefined,
	isReading:false,

	displayTextFile:function(data){
		//console.log(data);
		var $ta = $('#textarea');
		this.setFullText(data);
		$ta.show();
		

		this.initReading();
	},

	setFullText:function(data){
		this.text = data;
	},

	getFullText:function(){
		return this.text;
	},

	getNextChar:function(){
		return this.text[this.currentChar++];
	},

	getPrevChar:function(){
		return this.text[this.currentChar--];
	},

	getCurrentChar:function(){
		return this.currentChar;
	},

	setCurrentChar:function(newvalue){
		this.currentChar = newvalue;
	},

	hasNextChar:function(){
		//console.log('fulltxt length: '+this.text.length +' / currentChar: '+this.getCurrentChar());
		if(this.text.length === this.getCurrentChar())
			return false;
		return true;
	},

	initReading:function(){
		this.setCurrentChar(0);
		var $ta = $('#textarea');
		$ta.html('');
		this.toggleReadingMenu();
		this.showElement('#resetApp');
		this.readNextChar();
		/*this.updater = setInterval(function(){
			
			var $html = $ta.html();

			if(_this.hasNextChar())
				$ta.html($html+_this.getNextChar());
			else{
				clearInterval(_this.updater);
				_this.toggleFinishedMenu();
				_this.updater = undefined;
			}
		},this.readSpeed);*/
	},

	readNextChar:function(){
		var _this = this;
		this.isReading = true;
		var readFunc = function(){
			var $ta = $('#textarea');
			var $html = $ta.html();

			if(_this.hasNextChar()){
				if(_this.isReading){
					$ta.html($html+_this.getNextChar());
				}
				setTimeout(readFunc,_this.readSpeed);
			}else{
				_this.toggleFinishedMenu();
			}
			
		};

		setTimeout(readFunc,_this.readSpeed);
	},

	toggleMenu:function(){
		$('#main-menu').toggle();
	},

	toggleFinishedMenu:function(){
		$('#finishedmenu').toggle();
	},

	toggleTextarea:function(){
		$('#textarea').toggle();
	},

	toggleReadingMenu:function(){
		$('#readingmenu').toggle();
	},

	/**
	*	 This function takes a HTML5 file-object
	* *** **/
	getFileData:function(fileobject){
		var _this = this;
		var file = fileobject;

		var fr = new FileReader();
		fr.readAsText(file,'utf-8');
		fr.onloadend = function(e){
			var result = fr.result;
			_this.toggleMenu();
			_this.displayTextFile(result);
		};
	},

	readSlower:function(){
		this.restartReading();
		if(this.readSpeed < 500)
			this.readSpeed +=10;
		else
			this.readSpeed = 500;
	},

	readFaster:function(){
		this.restartReading();
		if(this.readSpeed > 0)
			this.readSpeed -=10;
		else
			this.readSpeed = 0;
	},

	resetApp:function(){
		this.hideElement('#finishedmenu');
		this.hideElement('#readingmenu');
		this.hideElement('#textarea');
		this.showElement('#main-menu');
	},

	hideElement:function(cssExpression){
		$(cssExpression).hide();
	},

	showElement:function(cssExpression){
		$(cssExpression).show();
	},

	stopReading:function(){
		this.isReading = false;
	},

	restartReading:function(){
		this.isReading = true;
	}



};


$(document).ready(function(){

	$('#textarea').hide();
	reader.toggleFinishedMenu();
	reader.toggleReadingMenu();
	reader.hideElement('#resetApp');
	
	/***
			DRAGGNING OPERATION HANDLERS.
	****/

	$(document).on('drop',function(e){
		e.preventDefault();
	});

	$(document).on('dragover',function(e){
		e.preventDefault();
	});

	// Actual drop operation.
	$('#droparea').on('drop',function(e){
		e.preventDefault();
		e.stopPropagation();

		// Read the file.
		reader.getFileData(e.originalEvent.dataTransfer.files[0]);
		
	});



	/***
			HTML ELEMENT BUTTON HANDLERS
	***/

	$(document).on('click','#readnewfile',function(e){
		reader.toggleMenu();
		reader.toggleFinishedMenu();
		reader.toggleTextarea();
		reader.toggleReadingMenu();
		reader.hideElement('#resetApp');
	});

	$(document).on('click','#readagain',function(e){
		reader.initReading();
		reader.toggleFinishedMenu();
		reader.toggleReadingMenu();
	});


	// READINGMENU, the menu that shows up while reading.

	$(document).on('click','#rmenuslower',function(e){
		reader.readSlower();
	});

	$(document).on('click','#rmenustop',function(e){
		reader.stopReading();
	});

	$(document).on('click','#rmenufaster',function(e){
		reader.readFaster();
		
	});

	$(document).on('click','#resetApp',function(e){
		reader.resetApp();
		reader.hideElement('#resetApp');
	});

	$(document).on('click','#sendRawTextInputButton',function(e){
		reader.toggleMenu();
		var $i = $('#rawTextInputArea');
		var data = $i.val();
		$i.val('');
		reader.displayTextFile(data);
	});

});