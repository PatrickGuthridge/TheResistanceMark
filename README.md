# TheResistanceMark
***Please note that this software is currently still under major development and therfore this file may not be up-to-date or accurate.***

ResistanceMark is an open-source web browser benchmark designed to test the speed at which two asynchronous WebWorkers threads can run simultaneously.
Scores are calculated using the ratio between the return values of the two threads once the user-defined amount of iterations is reached.
Note that lower scores are better [with zero being perfect :-] and score will vary across computers. Go to the Github.io page for a full score analysis (coming soon, be patient). 
The most accurate scores are achieved when the browser is started anew, better scores are generally achieved if the browser is clean installed.
DO NOT HAVE THE BROWSER DEV CONSOLE OPEN AT THE TIME OF TESTING. It often causes (especially on on Chromium Blink based browsers) terrible scores sometimes double or triple the expected score.
Do not test multiple browsers at the same time as this is a very CPU intensive task, make sure only one browser is open at a time (perhaps unless you have a 20C/40T Xeon).


It is vitally important that the correct test for your system is selected.
Using large tests on limited RAM can cause significant inaccuracies and potentially much worse scores.
The benchmark is designed so that in theory (if the browser and computer were flawless) the same score would be achieved for each test.
However, larger benchmarks are used to test how the browser deals with pressure and reveal patterns in the browsers behaviour when under stress.
In later versions, the benchmark will render graphs and detect patterns in the scores to give the user a better insight into the browser's performance.
Generally, the standardised test should be used to get a fast, overall picture. However:
	- If looking for browser speed, use the 1000 set single test.
	- If looking for browser stability and/or stress resistance consider using higher tests(16000 is usually good, however if your computer is strong, consider going up to 32000 or even 64000).
	- There is now also a custom test option which is NON STANDARD, use it for experimenting only, not as a basis for browser comparison.

On the test drop down, the following comments are found on the sides:
	- -Depreciated- : This means that the test should only be used for speed or on low end systems.
	- -Not Recommended- : This will seriously test your browsers pressure resistance. Only select these tests if you have a strong system and are willing to wait.
	- -Non Standard- : These are only experimental and have not been proven to be accurate. They will often cause browsers to crash.


Only new web browsers that fully support WebWorkers are compatible with the benchmark(Meaning that all versions of IE are unsupported).
Currently the best scores are achieved by Vivaldi Browser and Mozilla Firefox (Closely followed by the other Chromium based browsers), with the worst being (by a considerable margin) MS Edge.

Feedback is greatly appreciated. A form will soon be available on the Github.io page.
Also, if you find any issues with the software, please file them.
This project soon will see great developments, in versatility, accuracy and aesthetics.
This test will also soon broaden out to a latency tester (which Chrome seems to be smashing) and a separate HTML and CSS engine test.
Hopefully it will become something that will play a part in the brewing browser battle, as Multithreading, stability and speed are things that are expected for the modern web!

*Last Updated 4/09/17;
If the readme file needs updating, please file an issue.

