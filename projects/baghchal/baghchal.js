	//canvas variables
	var bag_canvas;
	var bag_context;
	var canvas_width = 750;
	var canvas_height = 750;

	//board dimension
	var width = 500;
	var height = 500;


	// error display
	var error="play";

	//temp variable to draw rectangle
	var drawRect_onclickX=0;
	var drawRect_onclickY=0;

	//temp varialble for board point
	var bp ; //board point
	var padding = 10;
	var scale_x = width/4;
	var scale_y = height/4;
	
	//origin shift to board point
	  var image_shift_x=50;
	  var image_shift_y=50;
	  //var canvas_shift_x=62;
	  //var canvas_shift_y=20;
	  var canvas_shift_x=10;
	  var canvas_shift_y=5;
	
	var shift_x = image_shift_x+canvas_shift_x;
	var shift_y = image_shift_y+canvas_shift_y;

	// for  global access of click position
	var click_x;
	var click_y;

	//resources
	var rect= new Image(60,60);
	rect.src= "./rect.png";

	var bag_img = new Image(60,60);
	bag_img.src= "./tiger.png";

	var goat_img = new Image(50,50);
	goat_img.src= "./goat.png";

	var board_img= new Image(600,600);
	board_img.src= "./board.png";

	// goat handling

	//to detect if goat can be eaten by bag
	var eatable_goatsPoint;
	var goat_at_midpointx;
	var goat_at_midpointy;
	var goatsRemaining;
	var dead_goat=0;    
	var goat_on_board=0;   
	var goat_count=0;


	var goat=1;
	var bag=2;
	var turn = goat; //to switch turn


	var previousClick_onBag=0; 
	var previousClick_onGoat=0;
	var previous_boardPoint;
	var temp_x=0;
	var temp_y=0;



	var dx = 5;
	var dy = 3;
	var dragok = false;

	var dragObject  = false;
	var mouseOffset = false;


	var board = new Array();

	var boardPointRange = 40; // mouse click detection at this range



function bagchaal ()
{


	this.init = function ()
	{
		bag_canvas = document.getElementById("bagchaal");
		// using 2d context canvas
		bag_context = bag_canvas.getContext("2d");

		bag_context.drawImage(board_img, canvas_shift_x, canvas_shift_y);

		bag_canvas.onmousemove = mouseMove;

		bag_canvas.onclick =  bagchaal_OnClick;
		
		bag_canvas.addEventListener("//click",  bagchaal_OnClick, false);

		var o = this; // CAPTURE THIS
		this.interval = setInterval(function(){	o.draw()},50);

		return this;

	}

	this.clear_canvas = function ()
						{
						this.init_board();
						init_boardpoint_set();
						return this;
						}


	this.draw = function ()
				{                   
					display_goatCount(goat_count); 

					error_display(error);

					goatsRemaining = 20-goat_count;

					dead_goat=goat_count-goat_on_board;//calculate dead goats

					display_goatsRemaining(goatsRemaining);

					display_deadGoats(dead_goat);

					display_turn(turn);

					bag_context.drawImage(board_img, canvas_shift_x, canvas_shift_y);//draw board image

					if(drawRect_onclickX!=0)//no rectangle  before click
					bag_context.drawImage(rect, drawRect_onclickX-35, drawRect_onclickY-35);

					if(turn==goat)
					get_boardPoint_Goat();
					
					else if (turn == bag )
					get_boardPoint_Bag();


					for (i=0; i< board.length; i++)
					{

						var bp = board[i];
						if (bp.value == bag )
						bag_context.drawImage(bag_img, bp.x - bag_img.width/2, bp.y - bag_img.height/2);
						if (bp.value == goat )
						bag_context.drawImage(goat_img, bp.x - goat_img.width/2, bp.y - goat_img.height/2);

					}

					return this;

				}//object draw function ends here

	function rect_clear (x,y,w,h)
	{   bag_context.fillStyle = "#fcfcfc";
		bag_context.beginPath();
		bag_context.fillRect(x,y,w,h);
		bag_context.closePath();
		bag_context.stroke();

	   return this;
	}
}

	/*------------------------------------------
	              <mouse_functions>
	------------------------------------------*/

	function mouseMove(ev)
	{
	   ev = ev || window.event;
	   mousePos = mouseCoords(ev);

		if(dragObject)
		{
			dragObject.style.position = 'absolute';
			dragObject.style.top      = mousePos.y - mouseOffset.y;
			dragObject.style.left     = mousePos.x - mouseOffset.x;

			return false;
		}
		
		move_x=mousePos.x - bag_canvas.offsetLeft;
		move_y=mousePos.y- bag_canvas.offsetTop;
	}



	function mouseCoords(ev)
	{
				if(ev.pageX || ev.pageY){
					return {x:ev.pageX, y:ev.pageY};
					}
				return {
					x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
					y:ev.clientY + document.body.scrollTop  - document.body.clientTop
				       };
				
	}
				
	function bagchaal_OnClick(ev)
	{

	 mp();
	 mp.x=ev.pageX - bag_canvas.offsetLeft;
	 mp.y=ev.pageY - bag_canvas.offsetTop;
	 click_x = mp.x;
	 click_y = mp.y;

	 return {x:click_x,y:click_y};

	}


	function mp(x, y)
	{
	 this.x = x;
	 this.y = y;
	}



	/*------------------------------------------
	</board point setting function>
	------------------------------------------*/

	function boardPoint(row,col,x,y,value,number)
	{
		this.row = row;
		this.col = col;
		this.x = x;
		this.y = y;
		this.value = value;
		this.number = number;
		return this;
	}

	/*------------------------------------------
	</movement for goat onclick>
	------------------------------------------*/


	this.get_boardPoint_Goat = function()

	{   
		if(click_x)
		{

			temp_x=click_x;
			temp_y=click_y;


			for(var i=0; i< board.length ;i++)
			{

				//selects  goat	
				if( checkPointrange(i) && board[i].value==goat && goat_count==20 )
				{    
					previous_boardPoint=board[i];
					previousClick_onGoat =1;
					drawRect_onclickX = board[i].x;
					drawRect_onclickY = board[i].y;

				}

				//load goat on empty point
				else if(checkPointrange(i)&& board[i].value == 0 && goat_count < 20)
				{
					drawRect_onclickX = board[i].x;
					drawRect_onclickY = board[i].y;
					board[i].value= goat;
					goat_count++;
					goat_on_board++;
					switchPlayers();
				}
				
				//move seleted goat on empty point
				else if( checkPointrange(i) && board[i].value == 0 && goat_count == 20 && previousClick_onGoat == 1 )
				{     
					drawRect_onclickX = board[i].x;
					drawRect_onclickY = board[i].y;

					if(allowedMovement(i))
					{
						board[i].value = goat; 
						for(var j=0; j< board.length ;j++)
						{  if(previous_boardPoint.x== board[j].x && previous_boardPoint.y== board[j].y)
						   board[j].value=0;
						}	
						switchPlayers();
					}				


				}

				click_x = 0;
			}
		}

	}	

	/*------------------------------------------
	</movement for tiger onclick>
	------------------------------------------*/

	this.get_boardPoint_Bag = function()
	{   
		if(click_x)
		{
			temp_x = click_x;
			temp_y = click_y;



			for(var i=0; i< board.length ; i++)             
			{ 
				//selects  tiger
				if( checkPointrange(i) && board[i].value == bag )
				{            
					previous_boardPoint=board[i];//temporarily store the point information

					previousClick_onBag=1;//inform first click has been done at tiger

					drawRect_onclickX = board[i].x;
					drawRect_onclickY = board[i].y;
				}
				//move seleted tiger on empty point
				else if(checkPointrange(i) && board[i].value == 0 && previousClick_onBag == 1)//if clicked pt. empty
				{     
					drawRect_onclickX = board[i].x;
					drawRect_onclickY = board[i].y;
					
					if(allowedMovement(i))
					{
  					    board[i].value = bag;

						for(var j=0; j< board.length ;j++)
						{ 
						  if(previous_boardPoint.x== board[j].x && previous_boardPoint.y== board[j].y)
						  {
						    board[j].value=0;
						    error="play";
						  } 
						}
						switchPlayers();
					}

					else
					error="Oops!";
					previous_Click = 0;
					previous_boardPoint = 0;
				}
				click_x=0;
			}
		}
	}


	/*------------------------------------------
	</initializing board points>
	------------------------------------------*/
	
    function init_boardpoint_set ()
	{
		var x=0, y = 0, value = 0, row = 0, col =0,number=0;

		for (col =0; col < 5; col ++)
		{
			for (row = 0; row < 5; row++)
			{
				if ((row == 0 && col == 0)||(row == 4 && col == 0)||(row == 0 && col == 4)||(row == 4 && col == 4))
				{
					var x = scale_x * col;
					var y = scale_y * row;
					var value = bag; //bagh
				}
				else
				{
					var x = scale_x * col;
					var y = scale_y * row;
					var value = 0; //blank

				}
				
				var bp = new boardPoint(row, col, x + shift_x, y+shift_y, value,number);
				//console.log (bp);

				board.push(bp);
				x =0; y=0, value = 0;
				
				number++;

			}
		}
	}

	//change the turn of players
	function switchPlayers() 
	{
		if (turn==goat)
		turn=bag;
		else turn=goat;
	}
	
	//area of the point to capture click
	function checkPointrange(i)  
	{
		if((temp_x > board[i].x-30 && temp_x < board[i].x+30 )&&(temp_y > board[i].y-30 && temp_y < board[i].y+30)) 
		return true;
		else
		return false;
	}		  

	function allowedMovement(i)
	{  
		if(previous_boardPoint.number % 2 == 0) 
		{  
			if(previous_boardPoint.number+1 == board[i].number ||previous_boardPoint.number-1 == board[i].number ||              previous_boardPoint.number+5 == board[i].number || previous_boardPoint.number-5 == board[i].number ||               previous_boardPoint.number+4 == board[i].number ||previous_boardPoint.number-4 == board[i].number ||               previous_boardPoint.number-6 == board[i].number ||previous_boardPoint.number+6 == board[i].number )
			{ 
			 return true;
			}

			else if(previous_boardPoint.number+2 == board[i].number ||previous_boardPoint.number-2 == board[i].number            ||previous_boardPoint.number+10 == board[i].number || previous_boardPoint.number-10 == board[i].number ||             previous_boardPoint.number+8 == board[i].number ||previous_boardPoint.number-8 == board[i].number ||              previous_boardPoint.number-12 == board[i].number ||previous_boardPoint.number+12 == board[i].number  )
			{  
				goat_at_midpointx=(board[i].col+previous_boardPoint.col)/2;
				goat_at_midpointy=(board[i].row+previous_boardPoint.row)/2;

				for(var j=0; j< board.length ;j++)
				{ 
				  if(goat_at_midpointx == board[j].col && goat_at_midpointy == board[j].row )
				  eatable_goatsPoint=j;
				}	
				if(board[eatable_goatsPoint].value==goat)
				{
					board[eatable_goatsPoint].value=0;
					goat_on_board--;
					eatable_goatsPoint=null;
					return true;
				}
				else return false;
			}
		} 
		else 
		{  
			if(previous_boardPoint.number+1 == board[i].number || previous_boardPoint.number-1 == board[i].number ||previous_boardPoint.number+5 == board[i].number ||previous_boardPoint.number-5 == board[i].number )
			{ 
			   return true;
			}
			else if(previous_boardPoint.number+2 == board[i].number ||previous_boardPoint.number-2 == board[i].number ||previous_boardPoint.number+10 == board[i].number || previous_boardPoint.number-10 == board[i].number )
			{ 
				goat_at_midpointx=(board[i].col+previous_boardPoint.col)/2;
				error_display(goat_at_midpointx);
				goat_at_midpointy=(board[i].row+previous_boardPoint.row)/2;

				for(var j=0; j< board.length ;j++)
				{ 
				  if(goat_at_midpointx == board[j].col && goat_at_midpointy == board[j].row )
				  eatable_goatsPoint=j;
				}	
				if(board[eatable_goatsPoint].value==goat)
				{
					board[eatable_goatsPoint].value=0;
					goat_on_board--;
					eatable_goatsPoint=null;
					return true;
				}
				else return false;
			}
			else 
			{  
				error="Oops!";
				error_display(error);
			    return false;
			}
		}
	}

	
	/*------------------------------------------
	</display game status>
	------------------------------------------*/
	function error_display(error)
	{
		document.getElementById('error').innerHTML=error;
	}

	function display_goatCount(goat_count)
	{
		document.getElementById('debug').innerHTML = goat_count;
	}

	function display_goatsRemaining(goatsRemaining)
	{
		document.getElementById('remaining').innerHTML = goatsRemaining;
	}

	function display_turn(sturn)
	{
		if(sturn==1) sturn="goat";
		else sturn="bag";		
		document.getElementById('turn').innerHTML = sturn;
	}

	function display_deadGoats(dead_goats)
	{
	 document.getElementById('dead_goats').innerHTML = dead_goats;
	}

	window.onload = function()
	{
		init_boardpoint_set ();
		var bagchaalGame = new bagchaal();
		bagchaalGame.init();
	}