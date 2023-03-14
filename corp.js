const COMPANY_NAME = 'Money Printer'
const AGRICULTURE_INDUSTRY_NAME = 'AG'
const TOBACCO_INDUSTRY_NAME = 'TB'

const jobs = {
	Operations: 'Operations',
	Engineer: 'Engineer',
	Business: 'Business',
	Management: 'Management',
	RND: 'Research & Development',
}

const UPGRADES = {
	SmartFactories: 'Smart Factories',
	WilsonAnalytics: 'Wilson Analytics',
	NeuralAccelerators: 'Neural Accelerators',
	ProjectInsight: 'Project Insight',
	SmartStorage: 'Smart Storage',
	NuoptimalNootropicInjectorImplants: 'Nuoptimal Nootropic Injector Implants',
	FocusWires: 'FocusWires',
	DreamSense: 'DreamSense',
	SpeechProcessorImplants: 'Speech Processor Implants',
	SalesBots: 'ABC SalesBots',
}

const productivityMaterials = ['Hardware', 'Robots', 'AI Cores', 'Real Estate']
const cities = ['Aevum', 'Chongqing', 'New Tokyo', 'Ishima', 'Volhaven', 'Sector-12']



function coffeeParty(ns, industryName) {
	for (const city of cities) {
		const office = ns.corporation.getOffice(industryName, city)
		if (office.avgEne < 95) ns.corporation.buyCoffee(industryName, city)
		if (office.avgHap < 95 || office.avgMor < 95) ns.corporation.throwParty(industryName, city, 500_000)
	}
}



function getUpgradesByCost(ns) {
	let upgradeCosts = []
	for (let upgrade of Object.values(UPGRADES)) {
		upgradeCosts.push({
			upgrade,
			upgradeCost: ns.corporation.getUpgradeLevelCost(upgrade),
		})
	}

	return upgradeCosts.sort((a, b) => {
		return a.upgradeCost - b.upgradeCost
	})
}


async function buyAffordableUpgrades(ns) {
	let upgradeList = getUpgradesByCost(ns)
	let upgradeLimit = 500
	while (ns.corporation.getCorporation().funds > ns.corporation.getCorporation().revenue * 10) {
		let cheapestUpgrade = upgradeList.shift()

		if (cheapestUpgrade.upgradeCost >= ns.corporation.getCorporation().revenue * 10) {
			return
		}

		ns.corporation.levelUpgrade(cheapestUpgrade.upgrade)
		await ns.sleep(0)
		upgradeList = getUpgradesByCost(ns)
	}
}

async function buyAffordableAdverts(ns) {
	let advertCost = ns.corporation.getHireAdVertCost(TOBACCO_INDUSTRY_NAME)
	if (ns.corporation.getCorporation().funds > 1_000_000_000 + advertCost) {
		ns.corporation.hireAdVert(TOBACCO_INDUSTRY_NAME)
	}
}


async function startNextProduct(ns) {
	let division = ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME)
	let allDivisionProducts = division.products.map((pname) => ns.corporation.getProduct(TOBACCO_INDUSTRY_NAME, pname))
	let shouldStartNewProduct = allDivisionProducts.every((product) => product.developmentProgress === 100)
	if (shouldStartNewProduct) {
		if (allDivisionProducts.length === 3) {
			let worstRatedProduct = allDivisionProducts.reduce(
				(product, worstSoFar) => (product.rat < worstSoFar.rat ? product : worstSoFar),
				allDivisionProducts[0]
			)
			ns.corporation.discontinueProduct(TOBACCO_INDUSTRY_NAME, worstRatedProduct.name)
		}
		let productPrefix = 'Product'
		let newProductName = `${productPrefix}${Date.now()}`
		let productPrice = ns.corporation.getCorporation().revenue// * 10
		if (ns.corporation.getCorporation().funds >= productPrice * 2) {
			ns.corporation.makeProduct(TOBACCO_INDUSTRY_NAME, 'Aevum', newProductName, productPrice, productPrice)
		}
	}

	for (let product of ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME).products) {
		ns.corporation.sellProduct(TOBACCO_INDUSTRY_NAME, 'Aevum', product, 'MAX', 'MP', true)
		if(ns.corporation.hasResearched(TOBACCO_INDUSTRY_NAME, "Market-TA.II")) {
			ns.corporation.setProductMarketTA2(TOBACCO_INDUSTRY_NAME, product, true)
		}
	}
}


export async function main(ns) {
	while (true) {
		while (ns.corporation.getCorporation().state != 'EXPORT') {
			await startNextProduct(ns)
			await buyAffordableUpgrades(ns)
			if (
				ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME).awareness <= 1.798e307 ||
				ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME).popularity <= 1.798e307
			) {
				await buyAffordableAdverts(ns)
			}
			await ns.sleep(0)
		}

		while (ns.corporation.getCorporation().state == 'EXPORT') {
			//same as above
			await ns.sleep(0)
		}

		//and to this part put things you want done exactly once per cycle
		if (!ns.corporation.hasResearched(TOBACCO_INDUSTRY_NAME, 'AutoBrew')) {
			coffeeParty(ns, TOBACCO_INDUSTRY_NAME)
		}
	}
}
