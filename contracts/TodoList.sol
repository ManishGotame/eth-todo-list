pragma solidity ^0.5.0;

contract TodoList {
	// keep the number of the tasks in the todo list

	uint public taskCount = 0; // this state variable is written directly to the blockchain

	struct Task { // this is like a datatype in c++
		uint id; // that will be the taskCount but incremented
		string content;
		bool completed; 
	}

	// but how do we access these data as a list?

	mapping(uint => Task) public tasks; // mapping or dict
	// key and the data, kind of like a databse

	// make a constructure or __init__ -- it is called whenever the smart contract is run for the first time
	// add a default todo list

	// this is an event
	event TaskCreated(
		uint id,
		string content,
		bool completed
	);

	event TaskCompleted(
		uint id,
		bool completed
	);

	constructor() public {
		createTask("This is the first task!!");
	}

	function createTask(string memory _content) public {
		taskCount++;
		tasks[taskCount] = Task(taskCount, _content, false);
		emit TaskCreated(taskCount, _content, false);
	}

	function toggleCompleted(uint id) public {
		Task memory _task = tasks[id]; // that underscore is just a convention

		_task.completed = !_task.completed;
		tasks[id] = _task;
		
		emit TaskCompleted(id, _task.completed);
	}
}