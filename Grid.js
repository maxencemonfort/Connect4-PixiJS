class Grid {

	constructor(){
		this.NB_COL=7;
		this.NB_ROW=6;

		this.Empty=0;
		this.Player=1;
		this.Computer=2;
		this.ResearchDeep=4;
		this.raz();
	}

	//resets the grid
	raz(){
		this.grid=[];
		for(var i=0;i<this.NB_COL;i++){
			this.grid[i]=[];
			for(var j=0;j<this.NB_ROW;j++){
				this.grid[i][j]=this.Empty;
			}
		}
	}

	//duplicates the gridbis
	copy(gridbis){
		for(var col=0;col<this.NB_COL;col++){
			for(var row=0;row<this.NB_ROW;row++){
				this.grid[col][row]=gridbis.grid[col][row];
			}
		}
	}

	//gets the owner of the coin column c and row r
	get(c, r){
		if(c>=0 && c<this.NB_COL && r>=0 && r<this.NB_ROW){
			return this.grid[c][r];
		}else{
			return this.Empty;
		}
	}

	//gets the opponent of player
	opponent(player){
		if(player==this.Player){
			return this.Computer;
		}else{
			return this.Player;
		}
	}

	//detects if the column is full
	canPlayThere(column){
		if(this.grid[column][this.NB_ROW-1]==this.Empty){
			return true;
		}else{
			return false;
		}
	}

	//detects if the grid is full
	full(){
		var full=true;
		var i=0;
		while(i<this.NB_COL && full){
			if(this.canPlayThere(i)){
				full=false;
			}
			i++;
		}
		return full;
	}

	//add a coin from player in column and returns the row where the coin ended
	playThere(column, player){
		var row=0;
		while(row<this.NB_ROW && this.grid[column][row]!==this.Empty){
			row++;
		}
		if(row<this.NB_ROW){
			this.grid[column][row]=player;
		}
		return row;
	}

	stuck(){
		if(this.winner()!==this.Empty){
			return true;
		}else{
			return this.full();
		}
	}

	//tests if there is a winner (one direction)
	horizontalWinner(col,row){
		if(this.grid[col][row]==this.grid[col+1][row]
			&& this.grid[col][row]==this.grid[col+2][row]
			&& this.grid[col][row]==this.grid[col+3][row]){
			return this.grid[col][row];
		}else{
			return this.Empty;
		}
	}

	verticalWinner(col,row){
		if(this.grid[col][row]==this.grid[col][row+1]
			&& this.grid[col][row]==this.grid[col][row+2]
			&& this.grid[col][row]==this.grid[col][row+3]){
			return this.grid[col][row];
		}else{
			return this.Empty;
		}
	}

	diag1Winner(col,row){
		if(this.grid[col][row]==this.grid[col+1][row+1]
			&& this.grid[col][row]==this.grid[col+2][row+2]
			&& this.grid[col][row]==this.grid[col+3][row+3]){
			return this.grid[col][row];
		}else{
			return this.Empty;
		}
	}

	diag2Winner(col,row){
		if(this.grid[col][row]==this.grid[col+1][row-1]
			&& this.grid[col][row]==this.grid[col+2][row-2]
			&& this.grid[col][row]==this.grid[col+3][row-3]){
			return this.grid[col][row];
		}else{
			return this.Empty;
		}
	}

	//tests if there is a winner (all directions)
	winner(){
		var winner=this.Empty;
		var col=0;
		var row;
		while(winner==this.Empty && col<this.NB_COL){
			row=0;
			while(winner==this.Empty && row<this.NB_ROW){
				if(col<this.NB_COL-3 && this.horizontalWinner(col,row)!==this.Empty){
					winner=this.horizontalWinner(col,row);
				}
				else if(row<this.NB_ROW-3 && this.verticalWinner(col,row)!==this.Empty){
					winner=this.verticalWinner(col,row);
				}
				else if(col<this.NB_COL-3 && row<this.NB_ROW-3 &&this.diag1Winner(col,row)!==this.Empty){
					winner=this.diag1Winner(col,row);
				}
				else if(col<this.NB_COL-3 && row>2 && this.diag2Winner(col,row)!==this.Empty){
					winner=this.diag2Winner(col,row);
				}
				row++;
			}
			col++;
		}
		return winner;
	}

	//estimates if the player should play in column col using one direction
	horizontalEstimation(col,row,player){
		var opp=this.opponent(player);
		if(this.grid[col][row]!==opp
			&& this.grid[col+1][row]!==opp
			&& this.grid[col+2][row]!==opp
			&& this.grid[col+3][row]!==opp){
			return Math.floor(Math.pow(2,(this.grid[col][row]+this.grid[col+1][row]+this.grid[col+2][row]
				+this.grid[col+3][row])/player));
		}else{
			return 0;
		}
	}

	verticalEstimation(col,row,player){
		var opp=this.opponent(player);
		if(this.grid[col][row]!==opp
			&& this.grid[col][row+1]!==opp
			&& this.grid[col][row+2]!==opp
			&& this.grid[col][row+3]!==opp){
			return Math.floor(Math.pow(2,(this.grid[col][row]+this.grid[col][row+1]+this.grid[col][row+2]
				+this.grid[col][row+3])/player));
		}else{
			return 0;
		}
	}

	diag1Estimation(col,row,player){
		var opp=this.opponent(player);
		if(this.grid[col][row]!==opp
			&& this.grid[col+1][row+1]!==opp
			&& this.grid[col+2][row+2]!==opp
			&& this.grid[col+3][row+3]!==opp){
			return Math.floor(Math.pow(2,(this.grid[col][row]+this.grid[col+1][row+1]+this.grid[col+2][row+2]
				+this.grid[col+3][row+3])/player));
		}else{
			return 0;
		}
	}

	diag2Estimation(col,row,player){
		var opp=this.opponent(player);
		if(this.grid[col][row]!==opp
			&& this.grid[col+1][row-1]!==opp
			&& this.grid[col+2][row-2]!==opp
			&& this.grid[col+3][row-3]!==opp){
			return Math.floor(Math.pow(2,(this.grid[col][row]+this.grid[col+1][row-1]+this.grid[col+2][row-2]
				+this.grid[col+3][row-3])/player));
		}else{
			return 0;
		}
	}

	//estimates if the player should play in column col using all directions
	estimation(){
		let computer=0;
		let player=0;

		for(var col=0;col<this.NB_COL;col++){
			for(var row=0;row<this.NB_ROW;row++){
				if(col<this.NB_COL-3){
					computer+=this.horizontalEstimation(col,row,this.Computer);
					player+=this.horizontalEstimation(col,row,this.Player);
				}
				if(row<this.NB_ROW-3){
					computer+=this.verticalEstimation(col,row,this.Computer);
					player+=this.verticalEstimation(col,row,this.Player);
				}
				if(col<this.NB_COL-3 && row<this.NB_ROW-3){
					computer+=this.diag1Estimation(col,row,this.Computer);
					player+=this.diag1Estimation(col,row,this.Player);
				}
				if(col<this.NB_COL-3 && row>2){
					computer+=this.diag2Estimation(col,row,this.Computer);
					player+=this.diag2Estimation(col,row,this.Player);
				}
			}
		}
		return computer-player;
	}

	tag(currentPlayer, deep){
		if(this.stuck()){
			return this.winner();
		}
		else{
			if(deep==0){
				return this.Empty;
			}
			else{
				var sonEmpty=false;
				var sonLabel;
				var son= new Grid();
				for(var col=0;col<this.NB_COL;col++){
					son.copy(this);
					if(son.canPlayThere(col)){
						son.playThere(col,currentPlayer);
						sonLabel=son.tag(this.opponent(currentPlayer),deep-1);
						if(sonLabel==currentPlayer){
							return currentPlayer;
						}
						if(sonLabel==this.Empty){
							sonEmpty=true;
						}
					}
				}
				if(sonEmpty){
					return this.Empty;
				}else{
					return this.opponent(currentPlayer);
				}
			}
		}
	}

	//returns the column where the computer should play
	bestPlayForComputer(){
		var deep=this.ResearchDeep;

		var sonEmpty=this.NB_COL;
		var possiblePlay=this.NB_COL;
		var sonLabel;
		
		var bestPlay=this.NB_COL;
		var valueBestPlay=-Infinity;
		var valuePlay;

		var lessWorst=this.NB_COL;
		var valueLessWorst=-Infinity;

		var son=new Grid();
		for(var col=0;col<this.NB_COL;col++){
			son.copy(this);
			if(son.canPlayThere(col)){
				son.playThere(col,this.Computer);
				sonLabel=son.tag(this.Player,deep);
				if(sonLabel==this.Computer){
					return col;
				}
				valuePlay=son.estimation();
				if(sonLabel==this.Empty){
					if(valuePlay>valueBestPlay){
						valueBestPlay=valuePlay;
						bestPlay=col;
					}
				}else{
					if(valuePlay>valueLessWorst){
						valueLessWorst=valuePlay;
						lessWorst=col;
					}
				}
			}
		}
		if(bestPlay<this.NB_COL){
			return bestPlay;
		}else{
			return lessWorst;
		}
	}

	//returns a grid representing the grid
	toString(){
		var text="";
		for(var i=0;i<this.NB_COL;i++){
			for(var j=0;j<this.NB_ROW;j++){
				text+=this.grid[i][j]+" ";
			}
			text+="\n";
		}
		return text;
	}

}