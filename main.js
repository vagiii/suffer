(function(storyContent) {

    // Create ink story from the compiled story content
    var story = new inkjs.Story(storyContent);

    var storyContainer = document.getElementById('story');
    var outerScrollContainer = document.querySelector('.outerContainer');
    var portrait = document.querySelector('.photoContainer');
    var charPhoto = document.querySelector('.charphoto');

    var portraits = {
        "KIM": "kim.jpg", "HARRY": "harry.jpg",
        "LOGIC": "logic.jpg", "LOG": "logic.jpg",
        "RHETORIC": "rhetoric.jpg", "RHE": "rhetoric.jpg",
        "DRAMA": "drama.jpg", "DRA": "drama.jpg",
        "ENCYCLOPEDIA": "encyclopedia.jpg", "ENC": "encyclopedia.jpg",
        "CONCEPTUALIZATION": "conceptualization.jpg", "CON": "conceptualization.jpg",
        "VISUALCALCULUS": "visualcalculus.jpg", "VIS": "visualcalculus.jpg",
        "VOLITION": "volition.jpg", "VOL": "volition.jpg",
        "INLANDEMPIRE": "inlandempire.jpg", "INL": "inlandempire.jpg",
        "EMPATHY": "empathy.jpg", "EMP": "empathy.jpg",
        "AUTHORITY": "authority.jpg", "AUT": "authority.jpg",
        "SUGGESTION": "suggestion.jpg", "SUG": "suggestion.jpg",
        "ESPRITDECORPS": "espritdecorps.jpg", "ESP": "espritdecorps.jpg",
        "COMPOSURE": "composure.jpg", "COM": "composure.jpg",
        "ENDURANCE": "endurance.jpg", "END": "endurance.jpg",
        "PAINTHRESHOLD": "painthreshold.jpg", "PAI": "painthreshold.jpg",
        "PHYSICALINSTRUMENT": "physicalinstrument.jpg", "PHY": "physicalinstrument.jpg",
        "ELECTROCHEMISTRY": "electrochemistry.jpg", "ELE": "electrochemistry.jpg",
        "SHIVERS": "shivers.jpg", "SHI": "shivers.jpg",
        "HALFLIGHT": "halflight.jpg", "HAL": "halflight.jpg",
        "HANDEYECOORDINATION": "handeyecoordination.jpg", "HAN": "handeyecoordination.jpg",
        "PERCEPTION": "perception.jpg", "PER": "perception.jpg",
        "REACTIONSPEED": "reactionspeed.jpg", "REA": "reactionspeed.jpg",
        "SAVOIRFAIRE": "savoirfaire.jpg", "SAV": "savoirfaire.jpg",
        "INTERFACING": "interfacing.jpg", "INT": "interfacing.jpg"
    }

    var skills = {
        "int": {
            "LOGIC": "Logic", "LOG": "Logic", "ENCYCLOPEDIA": "Encyclopedia", "ENC": "Encyclopedia",
            "RHETORIC": "Rhetoric", "RHE": "Rhetoric", "DRAMA": "Drama", "DRA": "Drama",
            "CONCEPTUALIZATION": "Conceptualization", "CON": "Conceptualization",
            "VISUALCALCULUS": "Visual Calculus", "VIS": "Visual Calculus"
        },
        "psy": {
            "VOLITION": "Volition", "VOL": "Volition", "INLANDEMPIRE": "Inland Empire", "INL": "Inland Empire",
            "EMPATHY": "Empathy", "EMP": "Empathy", "AUTHORITY": "Authority", "AUT": "Authority",
            "SUGGESTION": "Suggestion", "SUG": "Suggestion", "ESPRITDECORPS": "Esprit de Corps", "ESP": "Esprit de Corps"
        },
        "fys": {
            "ENDURANCE": "Endurance", "END": "Endurance", "PAINTHRESHOLD": "Pain Threshold", "PAI": "Pain Threshold",
            "PHYSICALINSTRUMENT": "Physical Instrument", "PHY": "Physical Instrument",
            "ELECTROCHEMISTRY": "Electrochemistry", "ELE": "Electrochemistry", "SHIVERS": "Shivers", "SHI": "Shivers",
            "HALFLIGHT": "Half Light", "HAL": "Half Light"
        },
        "mot": {
            "HANDEYECOORDINATION": "Hand/Eye Coordination", "HAN": "Hand/Eye Coordination",
            "PERCEPTION": "Perception", "PER": "Perception", "REACTIONSPEED": "Reaction Speed", "REA": "Reaction Speed",
            "SAVOIRFAIRE": "Savoir Faire", "SAV": "Savoir Faire", "INTERFACING": "Interfacing", "INT": "Interfacing",
            "COMPOSURE": "Composure", "COM": "Composure"
        }
    }

    var checks = {
        "v-easy": "Enormously easy",
        "easy": "Easy",
        "m-easy": "Medium-easy",
        "medium": "Medium",
        "m-hard": "Medium-hard",
        "hard": "Hard",
        "v-hard": "Very hard",
        "extreme": "Extreme",
        "godly": "Godly"
    }

    // Global delay for fading in elements
    var delay = 0.0;

    // Start story loop
    continueStory(true);

    // Main story loop
    function continueStory(firstTime) {
        delay = 0.0;
        if (firstTime) {
            story.globalTags.forEach(tag => {
                var splitTag = splitPropertyTag(tag);
                if (splitTag && splitTag.property.toLowerCase() == "author") {
                    var byline = document.querySelector('.byline');
                    if (byline) byline.innerHTML = "by " + splitTag.val;
                }
                if (splitTag && splitTag.property.toLowerCase() == "theme") {
                    document.body.classList.add(splitTag.val);
                }
            });
        }


        var previousBottomEdge = contentBottomEdgeY();

        // Generate story text until we hit a choice
        while (story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();
            var customClasses = [];
            var newInnerText = null;

            // Any tags for this paragraph?
            story.currentTags.forEach(tag => {
                var splitTag = splitPropertyTag(tag);

                // SPEAKER: name
                if (splitTag && splitTag.property.toUpperCase() == "SPEAKER") {
                    var speaker = '<span class="name">' + splitTag.val + '</span> ';
                    for (var skillGroup in skills) {
                        var speakerKey = splitTag.val.toUpperCase();
                        if (skills[skillGroup][speakerKey]) {
                            speaker = '<span class="' + skillGroup + '">' + skills[skillGroup][speakerKey] + "</span> "
                        }
                    }
                    if (newInnerText) {
                        newInnerText = speaker + newInnerText
                    } else {
                        newInnerText = speaker + '— ' + paragraphText
                    }
                }

                //CHECK: difficulty-success
                else if (splitTag && splitTag.property.toUpperCase() == "CHECK") {
                    var checkParts = splitTag.val.toLowerCase().split('-');
                    var diff = checks[checkParts[0]] || checkParts[0];
                    var succ = checks[checkParts[1]] || checkParts[1];
                    newInnerText = '<span class="check">[' + diff + ': ' + succ + ']</span> — ' + paragraphText
                }

                //PORTRAIT: portrait
                else if (splitTag && splitTag.property.toUpperCase() == "PORTRAIT") {
                    var portraitName = splitTag.val.toUpperCase();
                    if (portraits[portraitName]) {
                        charPhoto.innerHTML = "<img src='images/" + portraits[portraitName] + "' alt='Portrait of " + portraitName + "'>";
                        // so that it doesn't flash between images
                        setTimeout(function() { portrait.style.display = "flex"; }, 10.0)
                    }
                }

                // CLASS: classname
                else if (splitTag && splitTag.property == "CLASS") {
                    customClasses.push(splitTag.val);
                }

                // CLEAR - removes all existing content.
                // RESTART - clears everything and restarts the story from the beginning
                else if (tag == "CLEAR" || tag == "RESTART") {
                    removeAll("p");
                    removeAll("img");
                    setVisible(".header", false);
                    firstTime = true;

                    if (tag == "RESTART") {
                        restart();
                        return;
                    }
                }
            });

            // Create paragraph element
            var paragraphElement = document.createElement('p');
            if (newInnerText) {
                paragraphText = newInnerText
            }

            // Logic that adds classes to text based on flags in ink 
            paragraphText = paragraphText.replace(/<end>/g, '</span>')
            paragraphText = paragraphText.replace(/<name>/g, '<span class="name">')
            paragraphText = paragraphText.replace(/<int>/g, '<span class="int">')
            paragraphText = paragraphText.replace(/<psy>/g, '<span class="psy">')
            paragraphText = paragraphText.replace(/<fys>/g, '<span class="fys">')
            paragraphText = paragraphText.replace(/<mot>/g, '<span class="mot">')
            paragraphText = paragraphText.replace(/<check>/g, '<span class="check">')
            paragraphText = paragraphText.replace(/<task>/g, '<span class="task">')

            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);

            // Add any custom classes derived from ink tags
            for (var i = 0; i < customClasses.length; i++)
                paragraphElement.classList.add(customClasses[i]);

            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);
            delay += 100.0;
        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function(choice) {

            var choiceParagraphElement = document.createElement('p');

            if (choice.text.includes('▸')) {
                choiceParagraphElement.classList.add("continue");
                choice.text = "CONTINUE ▸";
            } else if (choice.text.includes('■')) {
                choiceParagraphElement.classList.add("continue");
                choice.text = "END ■";
            } else if (choice.text.includes('<locked>')) {
                choiceParagraphElement.classList.add("locked");
                choiceParagraphElement.classList.add("choice");
                var textArray = choice.text.split('[')
                var textPartOne = textArray[0]
                var textPartTwo = textArray[1] ? textArray[1].split(']')[1] : "";
                choice.text = textPartOne + "[Locked]" + textPartTwo
            } else if (choice.text.includes('<red>')) {
                choiceParagraphElement.classList.add("red");
                choiceParagraphElement.classList.add("choice");
            } else if (choice.text.includes('<white>')) {
                choiceParagraphElement.classList.add("white");
                choiceParagraphElement.classList.add("choice");
            } else if (choice.text.includes('<read>')) {
                choiceParagraphElement.classList.add("read");
                choiceParagraphElement.classList.add("choice");
            } else {
                choiceParagraphElement.classList.add("choice");
            }

            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            showAfter(delay, choiceParagraphElement);
            delay += 1.0;

            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function(event) {
                event.preventDefault();

                var all_paragraphs = document.querySelectorAll('p');
                for (const element of all_paragraphs) {
                    element.classList.add("greyed");
                }

                removeAll("p.continue");
                removeAll("p.choice");
                portrait.style.display = "none";

                story.ChooseChoiceIndex(choice.index);
                continueStory();
            });
        });

        storyContainer.style.height = contentBottomEdgeY() + "px";

        if (!firstTime) {
            scrollDown(previousBottomEdge);
        } else {
            outerScrollContainer.scrollTo(0, 0);
        }
    }

    function restart() {
        story.ResetState();
        setVisible(".header", true);
        continueStory(true);
        outerScrollContainer.scrollTo(0, 0);
    }

    function showAfter(delay, el) {
        el.classList.add("hide");
        setTimeout(function() { el.classList.remove("hide") }, delay);
    }

    function scrollDown(previousBottomEdge) {
        var target = previousBottomEdge;
        var limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
        if (target > limit) target = limit;

        var start = outerScrollContainer.scrollTop;
        var dist = target - start;
        var duration = 300 + 300 * dist / 100;
        var startTime = null;

        function step(time) {
            if (startTime == null) startTime = time;
            var t = (time - startTime) / duration;
            if (t > 1) t = 1;
            var lerp = 3 * t * t - 2 * t * t * t;
            outerScrollContainer.scrollTo(0, (1.0 - lerp) * start + lerp * target);
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function contentBottomEdgeY() {
        var bottomElement = storyContainer.lastElementChild;
        return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
    }

    function removeAll(selector) {
        var allElements = storyContainer.querySelectorAll(selector);
        for (var i = 0; i < allElements.length; i++) {
            var el = allElements[i];
            el.parentNode.removeChild(el);
        }
    }

    function setVisible(selector, visible) {
        var allElements = storyContainer.querySelectorAll(selector);
        for (var i = 0; i < allElements.length; i++) {
            var el = allElements[i];
            if (!visible)
                el.classList.add("invisible");
            else
                el.classList.remove("invisible");
        }
    }

    function splitPropertyTag(tag) {
        var propertySplitIdx = tag.indexOf(":");
        if (propertySplitIdx != -1) {
            var property = tag.substr(0, propertySplitIdx).trim();
            var val = tag.substr(propertySplitIdx + 1).trim();
            return { property: property, val: val };
        }
        return null;
    }

})(storyContent);
