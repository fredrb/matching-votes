'use strict';

function getScoreBoard(mentors, mentees) {
    let score = [];
    mentors.forEach((mentor) => {
        let points = [];
        mentees.forEach((mentee) => {
            let point = Number(mentor.votes.positive.includes(mentee.name));
            if (mentor.votes.negative.includes(mentee.name))
                point -= 2;
            if (mentee.votes.positive.includes(mentor.name))
                point += 1;
            if (mentee.votes.negative.includes(mentor.name))
                point -= 2;

            points.push({
                name: mentee.name,
                value : point
            });
        });
        score.push({
            name : mentor.name,
            points : points
        });
    });
    return score;
};

function Node(mentor, mentee, score) {
    this.mentor = mentor;
    this.mentee = mentee;
    this.score = score;
    this.children = [];
};

function createSearchTree(scoreboard, excludedMentees) {
    let result = [];
    if (scoreboard.length > 0) {
        let mentor = scoreboard.pop();
        mentor.points.forEach((mentee) => {
            if (excludedMentees.includes(mentee.name) || mentee.value <= -4)
                return;
            let n = new Node(mentor.name, mentee.name, mentee.value);
            n.children = createSearchTree(scoreboard.slice(), excludedMentees.concat(mentee.name));
            result.push(n);
        });
    }
    return result;
};

function getPossibleMatches(node, score, currentMatch, matches) {
    let _score = node.score + score;
    let _currentMatch = currentMatch.concat([{
        mentor: node.mentor,
        mentee: node.mentee
    }]);

    if (node.children.length === 0) {
        matches.push({
            match: _currentMatch,
            score: _score
        });
    } else {
        node.children.forEach((c) => {
            if (_score > -3) {
                getPossibleMatches(c, _score, _currentMatch, matches);
            }
        });
    };
};

module.exports = function matching(mentors, mentees) {
    let matches = [];
    let scoreboard = getScoreBoard(mentors, mentees);
    let tree = createSearchTree(scoreboard, []);
    tree.forEach((n) => getPossibleMatches(n, 0, [], matches));
    matches.sort((m1, m2) => {
        if (m1.score < m2.score)
            return 1;

        if (m1.score > m2.score)
            return -1;

        return 0;
    });

    return matches;
};
