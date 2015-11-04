export default function http($httpProvider) {
    $httpProvider.useApplyAsync(true);
}

http.$inject = ['$httpProvider'];
