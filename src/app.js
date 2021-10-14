// javascript app that will talk to the blockchain here
// const Web3 = require('web3')
var web3 = require("web3");

App = {
	loading: false,
	contracts: {},

	load: async () => {
		// load app..
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()

		await App.render()
	},

	loadWeb3: async() => {
	    if (window.ethereum) {
	        window.web3 = new Web3(ethereum);
	        try {
   		    	App.web3Provider = web3.currentProvider
	        	console.log("request account access")
	            // Request account access if needed
	            await ethereum.enable();
	            // Acccounts now exposed
	            web3.eth.sendTransaction({/* ... */});
	        } catch (error) {
	            // User denied account access...
	        }
	    }
	    // Legacy dapp browsers...
	    else if (window.web3) {
	    	console.log("legacy dapp browsers stuffs")
	    	App.web3Provider = web3.currentProvider
	        window.web3 = new Web3(web3.currentProvider);
	        // Acccounts always exposed
	        web3.eth.sendTransaction({/* ... */});
	    }
	    // Non-dapp browsers...
	    else {
	        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
	    }
	},

	loadAccount: async() => {
		App.account = web3.eth.accounts[0]
		console.log(App.account)
	},

	loadContract: async() => {
		const todoList = await $.getJSON("TodoList.json")
		App.contracts.TodoList = TruffleContract(todoList)
		App.contracts.TodoList.setProvider(App.web3Provider)

		App.todoList = await App.contracts.TodoList.deployed()

		console.log(App.todoList)

	},

	render: async() => {
		// prevent double render

		if (App.loading) {
			return
		}

		App.setLoading(true)

		// show the account and render the tasks

		$("#account").html(App.account)
		await App.renderTasks()

		App.setLoading(false)
	},

	renderTasks: async() => {
		// load the tasks from the block chain
		const taskCount = await App.todoList.taskCount()
		const $taskTemplate = $(".taskTemplate")

		for(var i =1; i <= taskCount; i++) {
			var task = await App.todoList.tasks(i)
			var taskId = task[0].toNumber()
			var taskContent = task[1]
			var taskCompleted = task[2]

			var $newTaskTemplate = $taskTemplate.clone()

			$newTaskTemplate.find(".content").html(taskContent)

			$newTaskTemplate.find("input").prop("name", taskId).prop("checked", taskCompleted)

			if (taskCompleted) {
				$("#completedTaskList").append($newTaskTemplate)
			} else {
				$("#taskList").append($newTaskTemplate)
			}

			$newTaskTemplate.show()
		}



		// render out each task with anew task template
	},


	setLoading: (boolean) => {
		App.loading = boolean
		const loader = $("#loader")
		const content = $("#content")

		if (boolean) {
			loader.show()
			content.hide()
		} else {
			loader.hide()
			content.show()
		}
	},

}

$(() => {
	$(window).load(() => {
	 	App.load()
	}) 
})