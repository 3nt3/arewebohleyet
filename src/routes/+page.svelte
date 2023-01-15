<script lang="ts">
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	let wasLast = false;
	let loading = true;
	let lastEntry: any = null;
	import { initializeApp, type FirebaseOptions } from 'firebase/app';
	import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	const firebaseConfig: FirebaseOptions = {
		apiKey: 'AIzaSyCXzsIPaDnRI3eR0Cs_kd2m7G6xpGewP3E',
		authDomain: 'are-we-bohle-yet.firebaseapp.com',
		projectId: 'are-we-bohle-yet',
		storageBucket: 'are-we-bohle-yet.appspot.com',
		messagingSenderId: '361972540185',
		appId: '1:361972540185:web:67e4cd17606a223a9fdb88'
	};

	const app = initializeApp(firebaseConfig);

	const db = getFirestore(app);

	// add document to collection
	addDoc(collection(db, 'entries'), {
		date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		isThere: Math.random() > 0.5
	});

	// this runs when the component mounts
	onMount(async () => {
		const snapshot = await getDocs(collection(db, 'entries'));
		const data = snapshot.docs.map((doc) => doc.data());
		lastEntry = data[data.length - 1];
		wasLast = lastEntry.isThere;
		loading = false;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main class="bg-gray-900 w-screen h-screen flex flex-col justify-center items-center gap-4">
	<h1 class="text-8xl font-bold" class:text-green-600={wasLast} class:text-red-500={!wasLast}>
		{#if loading}
			...
		{:else if wasLast}Yes{:else}No{/if}
	</h1>
	{#if !loading}
		<p class="text-xl text-gray-400 max-w-[300px] text-center">
			Jonathan was{wasLast ? ' ' : ' not '}the last person at Bohlebots ©
		</p>
		<p class="text-lg text-gray-400 max-w-[300px] text-center">
			He was there {dayjs.duration(dayjs().diff(dayjs(lastEntry.date))).humanize()} ago
		</p>
	{/if}
</main>
